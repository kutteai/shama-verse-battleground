import { apiRequest } from "@/lib/apiClient"

export type ReportType = "challenge" | "video" | "user" | "comment"

// 1=Pending, 2=In Progress, 3=Resolved, 4=Rejected
export const REPORT_STATUS = {
  PENDING: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  REJECTED: 4,
} as const

export type ReportStatusValue = (typeof REPORT_STATUS)[keyof typeof REPORT_STATUS]

export const REPORT_STATUS_LABELS: Record<ReportStatusValue, string> = {
  1: "Pending",
  2: "In Progress",
  3: "Resolved",
  4: "Rejected",
}

export interface AdminReport {
  id: string
  report_type: ReportType
  reporter: {
    id: number
    username: string
    profile_pic: string | null
  }
  target_label: string
  target_id: string
  reason: string
  description: string
  status: ReportStatusValue
  status_display: string
  admin_notes: string
  created_at: string
  updated_at: string | null
}

export interface ModerationLogEntry {
  id: string
  admin_user: { id: number; username: string } | null
  action: string
  target_type: string
  target_id: string
  reason: string | null
  created_at: string
}

export interface ModerationLogsResponse {
  count: number
  next: string | null
  previous: string | null
  results: ModerationLogEntry[]
}

export function getReports(params: {
  content_type?: ReportType
  status?: ReportStatusValue
  search?: string
} = {}): Promise<AdminReport[]> {
  const query = new URLSearchParams()
  if (params.content_type) query.set("content_type", params.content_type)
  if (params.status != null) query.set("status", String(params.status))
  if (params.search) query.set("search", params.search)
  return apiRequest<AdminReport[]>(`/api/v1/challenge/admin/reports/?${query.toString()}`)
}

export function updateReportStatus(
  reportType: ReportType,
  reportId: string,
  newStatus: ReportStatusValue,
  adminNotes?: string
): Promise<{ id: string; status: number; admin_notes: string }> {
  return apiRequest(`/api/v1/challenge/admin/reports/${reportType}/${reportId}/`, {
    method: "POST",
    body: JSON.stringify({ status: newStatus, admin_notes: adminNotes ?? "" }),
  })
}

export function getModerationLogs(search?: string): Promise<ModerationLogsResponse> {
  const query = new URLSearchParams()
  if (search) query.set("search", search)
  return apiRequest<ModerationLogsResponse>(
    `/api/v1/challenge/admin/moderation-logs/?${query.toString()}`
  )
}
