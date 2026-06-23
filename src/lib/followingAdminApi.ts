import { apiRequest } from "@/lib/apiClient"

export interface TopFollowedUser {
  id: number
  username: string
  first_name: string
  last_name: string
  profile_pic: string | null
  talent: string | null
  followers_count: number
  following_count: number
}

export interface FollowTrendPoint {
  date: string
  count: number
}

export function getTopFollowedUsers(limit = 10): Promise<TopFollowedUser[]> {
  return apiRequest<TopFollowedUser[]>(`/api/v1/follow_system/admin/top-followed/?limit=${limit}`)
}

export function getFollowTrends(days = 30): Promise<FollowTrendPoint[]> {
  return apiRequest<FollowTrendPoint[]>(`/api/v1/follow_system/admin/follow-trends/?days=${days}`)
}
