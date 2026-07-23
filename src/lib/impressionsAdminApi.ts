import { apiRequest } from "@/lib/apiClient"
import type { TopLikedVideo } from "@/lib/likesAdminApi"

export interface TrendPoint {
  date: string
  count: number
}

interface LiteProfile {
  id: number
  username: string
  profile_pic: string | null
  talent: string | null
}

export interface TopViewedChallenge {
  id: string
  title: string
  challenger: LiteProfile
  challengee: LiteProfile
  status: number
  views_count: number
  favorite_count: number
  share_count: number
  created_at: string
}

export function getVideoImpressionsTrend(days = 30): Promise<TrendPoint[]> {
  return apiRequest<TrendPoint[]>(
    `/api/v1/challenge/admin/video-impressions-trend/?days=${days}`
  )
}

export function getChallengeImpressionsTrend(days = 30): Promise<TrendPoint[]> {
  return apiRequest<TrendPoint[]>(
    `/api/v1/challenge/admin/challenge-impressions-trend/?days=${days}`
  )
}

export function getTopViewedVideos(limit = 10): Promise<TopLikedVideo[]> {
  return apiRequest<TopLikedVideo[]>(
    `/api/v1/challenge/admin/top-viewed-videos/?limit=${limit}`
  )
}

export function getTopViewedChallenges(limit = 10): Promise<TopViewedChallenge[]> {
  return apiRequest<TopViewedChallenge[]>(
    `/api/v1/challenge/admin/top-viewed-challenges/?limit=${limit}`
  )
}
