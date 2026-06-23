import { apiRequest } from "@/lib/apiClient"

export type AccountStatus = "active" | "suspended" | "warned"

export interface AdminUser {
  id: number
  username: string
  email: string
  phone: string | null
  profile_pic: string | null
  followers_count: number
  challenges_count: number
  account_status: AccountStatus
  is_active: boolean
  date_joined: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export function getUsers(params: {
  search?: string
  accountStatus?: AccountStatus
  page?: number
} = {}): Promise<PaginatedResponse<AdminUser>> {
  const query = new URLSearchParams()
  if (params.search) query.set("search", params.search)
  if (params.accountStatus) query.set("account_status", params.accountStatus)
  if (params.page && params.page > 1) query.set("page", String(params.page))
  const qs = query.toString()
  return apiRequest<PaginatedResponse<AdminUser>>(`/api/v1/accounts/admin/users/${qs ? `?${qs}` : ""}`)
}

export function suspendUser(userId: number, reason: string): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/api/v1/accounts/admin/users/${userId}/suspend/`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  })
}

export function reactivateUser(userId: number): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/api/v1/accounts/admin/users/${userId}/reactivate/`, {
    method: "POST",
  })
}

export function warnUser(userId: number, message: string): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/api/v1/accounts/admin/users/${userId}/warn/`, {
    method: "POST",
    body: JSON.stringify({ message }),
  })
}

export function contactUser(userId: number, subject: string, message: string): Promise<null> {
  return apiRequest<null>(`/api/v1/accounts/admin/users/${userId}/contact/`, {
    method: "POST",
    body: JSON.stringify({ subject, message }),
  })
}
