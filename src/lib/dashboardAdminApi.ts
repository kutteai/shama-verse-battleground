import { apiRequest } from "@/lib/apiClient"

export interface DashboardSummary {
  total_users: number
  active_users: number
  signups_this_week: number
  active_last_24h: number
  total_challenges: number
  running_challenges: number
  completed_challenges: number
  challenges_this_week: number
  total_videos: number
  videos_this_week: number
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

export function getDashboardSummary(): Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>("/api/v1/accounts/admin/dashboard/summary/")
}

export function getDashboardTrends(days = 30): Promise<DashboardTrends> {
  return apiRequest<DashboardTrends>(`/api/v1/accounts/admin/dashboard/trends/?days=${days}`)
}
