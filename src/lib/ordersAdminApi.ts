import { apiRequest } from "@/lib/apiClient"

export interface Order {
  id: number
  product_name: string
  size: string
  quantity: number
  unit_price: string
  total_amount: string
  currency: string
  customer_email: string
  status: "pending" | "paid" | "failed" | "canceled"
  created_at: string
}

export interface PaginatedOrders {
  count: number
  next: string | null
  previous: string | null
  results: Order[]
}

export function listOrders(page = 1): Promise<PaginatedOrders> {
  const query = new URLSearchParams()
  if (page > 1) query.set("page", String(page))
  return apiRequest<PaginatedOrders>(`/api/v1/merch/orders/?${query.toString()}`)
}
