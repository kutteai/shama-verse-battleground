import { apiRequest } from "@/lib/apiClient"

export interface UserSegment {
  name: string
  description: string
  count: number
  percentage: number
}

export function getUserSegments(): Promise<UserSegment[]> {
  return apiRequest<UserSegment[]>("/api/v1/accounts/admin/user-segments/")
}
