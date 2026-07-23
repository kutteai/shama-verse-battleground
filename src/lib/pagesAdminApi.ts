import { apiRequest } from "@/lib/apiClient"

export interface AdminPage {
  id: number
  name: string
  title: string
  is_active: boolean
  view_count: number
  avg_duration_seconds: number
  created_at: string
  updated_at: string
}

export interface PaginatedPages {
  count: number
  next: string | null
  previous: string | null
  results: AdminPage[]
}

export interface TrendPoint {
  date: string
  count: number
}

export function listPages(page = 1): Promise<PaginatedPages> {
  const query = new URLSearchParams()
  if (page > 1) query.set("page", String(page))
  return apiRequest<PaginatedPages>(`/api/v1/pages/admin/?${query.toString()}`)
}

export function createPage(params: {
  name: string
  title: string
  is_active?: boolean
}): Promise<AdminPage> {
  return apiRequest<AdminPage>("/api/v1/pages/admin/", {
    method: "POST",
    body: JSON.stringify(params),
  })
}

export function updatePage(
  id: number,
  params: Partial<{ name: string; title: string; is_active: boolean }>
): Promise<AdminPage> {
  return apiRequest<AdminPage>(`/api/v1/pages/admin/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(params),
  })
}

export function deletePage(id: number): Promise<null> {
  return apiRequest<null>(`/api/v1/pages/admin/${id}/`, { method: "DELETE" })
}

export function getPageViewsTrend(days = 30): Promise<TrendPoint[]> {
  return apiRequest<TrendPoint[]>(`/api/v1/pages/admin/views-trend/?days=${days}`)
}
