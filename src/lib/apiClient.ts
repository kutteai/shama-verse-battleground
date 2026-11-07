import { getToken, redirectToLogin } from "@/lib/session"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"

// Login itself can return 401 for wrong credentials; that must not redirect.
const LOGIN_PATH = "/api/v1/accounts/admin/login/"

interface ApiEnvelope<T> {
  status: "success" | "error"
  message: string
  data: T | null
  errors: Record<string, unknown> | null
}

export class ApiError extends Error {
  status: number
  errors: Record<string, unknown> | null

  constructor(message: string, status: number, errors: Record<string, unknown> | null = null) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.errors = errors
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  // FormData (file uploads) needs the browser to set the multipart boundary.
  const isFormData = options.body instanceof FormData
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers["Authorization"] = `Token ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  // A 401 means the token was deleted (logged out elsewhere or replaced) and it
  // can't be renewed: send the admin back to login, then to this page.
  if (response.status === 401 && token && path !== LOGIN_PATH) {
    redirectToLogin(window.location.pathname + window.location.search)
    throw new ApiError("Your session has expired. Please log in again.", 401)
  }

  let envelope: ApiEnvelope<T>
  try {
    envelope = await response.json()
  } catch {
    // Non-JSON body, e.g. a proxy's HTML error page.
    throw new ApiError(`Request failed (${response.status})`, response.status)
  }

  if (!response.ok || envelope.status === "error") {
    throw new ApiError(envelope.message || "Request failed", response.status, envelope.errors)
  }

  return envelope.data as T
}
