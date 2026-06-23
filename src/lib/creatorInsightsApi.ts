import { apiRequest } from "@/lib/apiClient"

export interface AdminCreator {
  id: number
  username: string
  email: string
  profile_pic: string | null
  followers_count: number
  challenges_count: number
  likes_count: number
  is_verified: boolean
  date_joined: string
}

export interface PaginatedCreators {
  count: number
  next: string | null
  previous: string | null
  results: AdminCreator[]
}

export type CreatorSortBy = "followers_count" | "challenges_count" | "likes_count" | "date_joined"

export function getCreatorInsights(params: {
  search?: string
  sort_by?: CreatorSortBy
  page?: number
} = {}): Promise<PaginatedCreators> {
  const query = new URLSearchParams()
  if (params.search) query.set("search", params.search)
  if (params.sort_by) query.set("sort_by", params.sort_by)
  if (params.page && params.page > 1) query.set("page", String(params.page))
  return apiRequest<PaginatedCreators>(
    `/api/v1/challenge/admin/creator-insights/?${query.toString()}`
  )
}

export function toggleUserVerified(userId: number): Promise<{ is_verified: boolean }> {
  return apiRequest<{ is_verified: boolean }>(
    `/api/v1/accounts/admin/users/${userId}/verify/`,
    { method: "POST" }
  )
}
