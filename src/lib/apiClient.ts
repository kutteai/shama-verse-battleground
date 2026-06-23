const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"

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
  const token = localStorage.getItem("admin_token")

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers["Authorization"] = `Token ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const envelope: ApiEnvelope<T> = await response.json()

  if (!response.ok || envelope.status === "error") {
    throw new ApiError(envelope.message || "Request failed", response.status, envelope.errors)
  }

  return envelope.data as T
}
