import { apiRequest } from "@/lib/apiClient"

export interface AdminChallengeUser {
  id: number
  username: string
  profile_pic?: string | null
}

export interface AdminChallengeVideo {
  id: string
  video_url: string
  thumbnail_url: string | null
  views_count: number
  likes_count: number
  share_count: number
  favorite_count: number
  comments_count: number
  vote_count: number
  created_at: string
}

export interface AdminChallengeDetail {
  id: string
  title: string
  description: string | null
  status: number
  status_display: string
  challenge_type: number
  challenge_type_display: string
  created_at: string
  started_at: string | null
  video_upload_deadline: string | null
  is_paused_by_admin: boolean
  is_banned_by_admin: boolean
  challenger: AdminChallengeUser
  challengee: AdminChallengeUser
  challenger_video: AdminChallengeVideo | null
  challengee_video: AdminChallengeVideo | null
}

export interface AdminChallenge {
  id: string
  title: string
  challenger: AdminChallengeUser
  challengee: AdminChallengeUser
  status: number
  status_display: string
  challenge_type: number
  challenge_type_display: string
  is_paused_by_admin: boolean
  is_banned_by_admin: boolean
  created_at: string
}

export interface PaginatedChallenges {
  count: number
  next: string | null
  previous: string | null
  results: AdminChallenge[]
}

export const CHALLENGE_STATUS: Record<number, string> = {
  1: "Pending",
  2: "Accepted",
  3: "Rejected",
  4: "Expired",
  5: "Running",
  6: "Completed",
  7: "Cancelled",
  8: "Rescheduled",
  9: "Forfeited",
}

export function getChallenges(params: {
  status?: number
  challenge_type?: number
  search?: string
  page?: number
} = {}): Promise<PaginatedChallenges> {
  const query = new URLSearchParams()
  if (params.status != null) query.set("status", String(params.status))
  if (params.challenge_type != null) query.set("challenge_type", String(params.challenge_type))
  if (params.search) query.set("search", params.search)
  if (params.page && params.page > 1) query.set("page", String(params.page))
  return apiRequest<PaginatedChallenges>(
    `/api/v1/challenge/admin/challenges/?${query.toString()}`
  )
}

export function pauseChallenge(challengeId: string): Promise<{ id: string; is_paused_by_admin: boolean }> {
  return apiRequest(`/api/v1/challenge/admin/challenges/${challengeId}/pause/`, { method: "POST" })
}

export function resumeChallenge(challengeId: string): Promise<{ id: string; is_paused_by_admin: boolean }> {
  return apiRequest(`/api/v1/challenge/admin/challenges/${challengeId}/resume/`, { method: "POST" })
}

export function banChallenge(challengeId: string, reason?: string): Promise<{ id: string; is_banned_by_admin: boolean }> {
  return apiRequest(`/api/v1/challenge/admin/challenges/${challengeId}/ban/`, {
    method: "POST",
    body: JSON.stringify({ reason: reason ?? "" }),
  })
}

export function deleteChallenge(challengeId: string, reason?: string): Promise<void> {
  return apiRequest(`/api/v1/challenge/admin/challenges/${challengeId}/`, {
    method: "DELETE",
    body: JSON.stringify({ reason: reason ?? "" }),
  })
}

export function getChallengeDetail(challengeId: string): Promise<AdminChallengeDetail> {
  return apiRequest<AdminChallengeDetail>(
    `/api/v1/challenge/admin/challenges/${challengeId}/detail/`
  )
}
