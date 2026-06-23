import { apiRequest } from "@/lib/apiClient"

export interface AdminFreestyleUser {
  id: number
  username: string
  profile_pic: string | null
  talent: string | null
  user_category: number
}

export interface AdminFreestyleVideo {
  id: number
  title: string
  user: AdminFreestyleUser
  views_count: number
  likes_count: number
  share_count: number
  favorite_count: number
  created_at: string
  video_url: string | null
  thumbnail_url: string | null
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type FreestyleOrdering = "-created_at" | "created_at" | "-views_count" | "-likes_count" | "-share_count"

export function getFreestyles(params: {
  search?: string
  ordering?: FreestyleOrdering
  page?: number
} = {}): Promise<PaginatedResponse<AdminFreestyleVideo>> {
  const query = new URLSearchParams()
  if (params.search) query.set("search", params.search)
  query.set("ordering", params.ordering ?? "-created_at")
  if (params.page && params.page > 1) query.set("page", String(params.page))
  return apiRequest<PaginatedResponse<AdminFreestyleVideo>>(
    `/api/v1/challenge/admin/freestyles/?${query.toString()}`
  )
}
