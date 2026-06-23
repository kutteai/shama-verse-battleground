import { apiRequest } from "@/lib/apiClient"

export interface AdminUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  profile_pic: string | null
  is_staff: boolean
  is_superuser: boolean
  is_admin: boolean
  last_login: string | null
}

export interface AdminLoginResponse {
  token: string
  user: AdminUser
}

export function adminLogin(identifier: string, password: string): Promise<AdminLoginResponse> {
  return apiRequest<AdminLoginResponse>("/api/v1/accounts/admin/login/", {
    method: "POST",
    body: JSON.stringify({ username: identifier, password }),
  })
}
