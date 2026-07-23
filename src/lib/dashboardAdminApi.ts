import { apiRequest } from "@/lib/apiClient"

export interface DashboardSummary {
  total_users: number
  active_users: number
  new_signups: number
  active_last_24h: number
  total_challenges: number
  running_challenges: number
  completed_challenges: number
  new_challenges: number
  total_videos: number
  new_videos: number
}

export interface TrendPoint {
  date: string
  count: number
}

export interface DashboardTrends {
  user_signups: TrendPoint[]
  challenges_created: TrendPoint[]
  videos_created: TrendPoint[]
}

export function getDashboardSummary(days = 7): Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>(`/api/v1/accounts/admin/dashboard/summary/?days=${days}`)
}

export function getDashboardTrends(days = 30): Promise<DashboardTrends> {
  return apiRequest<DashboardTrends>(`/api/v1/accounts/admin/dashboard/trends/?days=${days}`)
}
