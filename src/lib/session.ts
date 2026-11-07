// The admin session lives in localStorage: the API token and the signed-in user.
const TOKEN_KEY = "admin_token"
const USER_KEY = "user"

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveSession(token: string, user: unknown) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/** The saved user, or null when there is no complete session (user and token). */
export function getSavedUser<T>(): T | null {
  const saved = localStorage.getItem(USER_KEY)
  if (!saved || !getToken()) return null
  try {
    return JSON.parse(saved) as T
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * Clears the session and loads the login page with a full page load, which
 * also drops every cached query and any open dialog or menu. When `returnTo`
 * is set, login sends the admin back to that page.
 */
export function redirectToLogin(returnTo?: string) {
  clearSession()
  const next = returnTo && returnTo !== "/login" ? `?next=${encodeURIComponent(returnTo)}` : ""
  window.location.replace(`/login${next}`)
}

/** Only same-site paths are allowed as a return target ("/users", not "//evil.com"). */
export function safeReturnPath(path: string | null | undefined): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/login")) {
    return null
  }
  return path
}
