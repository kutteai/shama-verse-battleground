import { apiRequest } from "@/lib/apiClient"

export type LeaderboardMetric = "followers" | "votes" | "likes" | "challenges" | "wins"

export interface LeaderboardUser {
  id: number
  username: string
  profile_pic: string | null
}

export interface LeaderboardEntry {
  rank: number
  user: LeaderboardUser
  value: number
}

export interface LeaderboardResponse {
  metric: string
  results: LeaderboardEntry[]
}

export function getUserLeaderboard(
  metric: Exclude<LeaderboardMetric, "wins">,
  limit = 20
): Promise<LeaderboardResponse> {
  return apiRequest<LeaderboardResponse>(
    `/api/v1/accounts/admin/leaderboard/?metric=${metric}&limit=${limit}`
  )
}

export function getChallengeWinsLeaderboard(limit = 20): Promise<LeaderboardResponse> {
  return apiRequest<LeaderboardResponse>(
    `/api/v1/challenge/admin/leaderboard/wins/?limit=${limit}`
  )
}
