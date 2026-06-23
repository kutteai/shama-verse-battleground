import { apiRequest } from "@/lib/apiClient"

export type RecipientType = "all" | "active" | "specific"

export interface NotificationCampaign {
  id: string
  title: string
  message: string
  recipient_type: RecipientType
  recipient_count: number
  status: "pending" | "sent" | "failed"
  scheduled_for: string | null
  sent_at: string | null
  created_at: string
  admin_user: { id: number; username: string } | null
}

export interface PaginatedCampaigns {
  count: number
  next: string | null
  previous: string | null
  results: NotificationCampaign[]
}

export function listCampaigns(page = 1): Promise<PaginatedCampaigns> {
  const query = new URLSearchParams()
  if (page > 1) query.set("page", String(page))
  return apiRequest<PaginatedCampaigns>(
    `/api/v1/challenge/admin/notifications/campaigns/?${query.toString()}`
  )
}

export function broadcastNotification(params: {
  title: string
  message: string
  recipient_type: RecipientType
  user_ids?: number[]
}): Promise<{ id: string; status: string; recipient_count: number; sent_at: string | null }> {
  return apiRequest(`/api/v1/challenge/admin/notifications/broadcast/`, {
    method: "POST",
    body: JSON.stringify(params),
  })
}

export function scheduleNotificationCampaign(params: {
  title: string
  message: string
  recipient_type: RecipientType
  user_ids?: number[]
  scheduled_for: string
}): Promise<{ id: string; status: string; scheduled_for: string | null }> {
  return apiRequest(`/api/v1/challenge/admin/notifications/schedule/`, {
    method: "POST",
    body: JSON.stringify(params),
  })
}
