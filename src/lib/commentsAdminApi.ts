import { apiRequest } from "@/lib/apiClient"

export interface AdminCommentUser {
  id: number
  username: string
  profile_pic: string | null
}

export interface AdminComment {
  id: string
  comment_type: "video" | "challenge"
  user: AdminCommentUser
  content: string
  content_title: string
  replies_count: number
  created_at: string
}

export interface AdminReportedComment extends AdminComment {
  report_id: string
  report_reason: string
}

export interface CommentModerationData {
  recent: AdminComment[]
  reported: AdminReportedComment[]
}

export function getCommentModerationData(search?: string): Promise<CommentModerationData> {
  const query = new URLSearchParams()
  if (search) query.set("search", search)
  const qs = query.toString()
  return apiRequest<CommentModerationData>(
    `/api/v1/comments/admin/moderation/${qs ? `?${qs}` : ""}`
  )
}

export function deleteComment(commentId: string): Promise<null> {
  return apiRequest<null>(`/api/v1/comments/admin/comments/${commentId}/`, {
    method: "DELETE",
  })
}

export function deleteChallengeComment(commentId: string): Promise<null> {
  return apiRequest<null>(`/api/v1/comments/admin/challenge-comments/${commentId}/`, {
    method: "DELETE",
  })
}
