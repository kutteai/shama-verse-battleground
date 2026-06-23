import { apiRequest } from "@/lib/apiClient"

export interface TopLikedVideo {
  id: string
  title: string
  user: {
    id: number
    username: string
    profile_pic: string | null
    talent: string | null
  }
  video_url: string
  thumbnail_url: string | null
  views_count: number
  likes_count: number
  share_count: number
  favorite_count: number
  created_at: string
}

export interface LikesTrendPoint {
  date: string
  count: number
}

export function getTopLikedVideos(limit = 10): Promise<TopLikedVideo[]> {
  return apiRequest<TopLikedVideo[]>(`/api/v1/challenge/admin/top-liked-videos/?limit=${limit}`)
}

export function getLikesTrend(days = 30): Promise<LikesTrendPoint[]> {
  return apiRequest<LikesTrendPoint[]>(`/api/v1/challenge/admin/likes-trend/?days=${days}`)
}
