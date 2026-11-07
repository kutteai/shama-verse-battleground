import { apiRequest } from "@/lib/apiClient"

export interface LocationChallengeAdminUser {
  id: number
  username: string
  profile_pic?: string | null
}

/** The competition categories: the artist talents the app sends, exactly. */
export const COMPETITION_CATEGORIES = [
  "Hip-hop/Rap",
  "Comedian",
  "Singer",
  "Spoken Word",
  "Beat Producer",
] as const
export type CompetitionCategory = (typeof COMPETITION_CATEGORIES)[number]

/** One area of a competition; the competition area is the union of their boxes. */
export interface CompetitionPlace {
  place_id: string
  name: string
  type: string
  ne_lat: number
  ne_lng: number
  sw_lat: number
  sw_lng: number
}

export interface CategoryPrize {
  category: CompetitionCategory
  amount: number
}

export interface Money {
  amount: number
  currency: string
  /** Built by the server, e.g. "$1,000". */
  display: string
}

export interface LocationChallengeEvent {
  id: string
  location: string
  /** Geofence: all three of center_latitude/center_longitude/radius_meters are set, or all null. */
  address: string | null
  center_latitude: number | null
  center_longitude: number | null
  radius_meters: number | null
  /** Branding: hex color like "#2563EB", and S3 URLs from uploadEventImage(). */
  theme_color: string | null
  icon_url: string | null
  image_url: string | null
  banner_url: string | null
  /** Markdown. */
  rules: string | null
  title_short: string | null
  locations_text: string | null
  location_short_name: string | null
  currency: string
  sponsor_name: string | null
  sponsor_icon_url: string | null
  badge_name: string | null
  badge_icon_url: string | null
  places: CompetitionPlace[]
  category_prizes: CategoryPrize[]
  /** Sum of the category prizes. */
  total_prize: Money
  /** Artists currently joined. */
  participants_count: number
  instructions: LocationChallengeInstruction[]
  tag: string | null
  title: string
  description: string | null
  starts_at: string
  ends_at: string
  is_active: boolean
  is_live: boolean
  ended_at: string | null
  completion_email_sent: boolean
  created_by: number | null
  created_by_username: string | null
  created_at: string
  updated_at: string
}

export interface LocationChallengeInstruction {
  id: string
  text: string
  icon_url: string | null
  /** Lower shows first. */
  sort_order: number
}

export interface LocationChallengeInstructionPayload {
  text: string
  icon_url?: string | null
  sort_order?: number
}

export interface LocationChallengeLedgerEntry {
  id: string
  user: LocationChallengeAdminUser
  wins: number
  losses: number
  ties: number
  points: number
  challenges_count: number
}

export interface LocationChallengeEventDetail {
  event: LocationChallengeEvent
  ledger_entries: LocationChallengeLedgerEntry[]
}

export interface PaginatedLocationChallengeEvents {
  count: number
  next: string | null
  previous: string | null
  results: LocationChallengeEvent[]
}

export interface LocationChallengeEventPayload {
  /** Optional: defaults to the first place's name. */
  location?: string
  address?: string | null
  center_latitude?: number | null
  center_longitude?: number | null
  radius_meters?: number | null
  theme_color?: string | null
  icon_url?: string | null
  image_url?: string | null
  banner_url?: string | null
  rules?: string | null
  title_short?: string | null
  locations_text?: string | null
  location_short_name?: string | null
  sponsor_name?: string | null
  sponsor_icon_url?: string | null
  badge_name?: string | null
  badge_icon_url?: string | null
  /** Replaces the saved list when sent. */
  places?: CompetitionPlace[]
  /** Replaces the saved list when sent. Categories and the total prize come from these rows. */
  category_prizes?: CategoryPrize[]
  /** Replaces the event's whole instruction list when sent. */
  instructions?: LocationChallengeInstructionPayload[]
  tag?: string
  title: string
  description?: string
  starts_at: string
  ends_at: string
}

export function getEvents(params: {
  location?: string
  is_live?: boolean
  search?: string
  page?: number
} = {}): Promise<PaginatedLocationChallengeEvents> {
  const query = new URLSearchParams()
  if (params.location) query.set("location", params.location)
  if (params.is_live != null) query.set("is_live", String(params.is_live))
  if (params.search) query.set("search", params.search)
  if (params.page && params.page > 1) query.set("page", String(params.page))
  return apiRequest<PaginatedLocationChallengeEvents>(
    `/api/v1/location-challenges/admin/events/?${query.toString()}`
  )
}

// The backend returns the event's own fields flattened at the top level
// plus a sibling `ledger` array (not a nested `{event, ledger_entries}`
// envelope) — reshape it here so the rest of the app can keep using the
// more convenient nested shape without touching every call site.
type RawLocationChallengeEventDetail = LocationChallengeEvent & {
  ledger: LocationChallengeLedgerEntry[]
}

export function getEventDetail(eventId: string): Promise<LocationChallengeEventDetail> {
  return apiRequest<RawLocationChallengeEventDetail>(
    `/api/v1/location-challenges/admin/events/${eventId}/`
  ).then(({ ledger, ...event }) => ({ event, ledger_entries: ledger }))
}

export function createEvent(data: LocationChallengeEventPayload): Promise<LocationChallengeEvent> {
  return apiRequest<LocationChallengeEvent>(`/api/v1/location-challenges/admin/events/`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateEvent(
  eventId: string,
  data: Partial<LocationChallengeEventPayload> & { is_active?: boolean }
): Promise<LocationChallengeEvent> {
  return apiRequest<LocationChallengeEvent>(`/api/v1/location-challenges/admin/events/${eventId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function endEvent(eventId: string, reason?: string): Promise<LocationChallengeEvent> {
  return apiRequest<LocationChallengeEvent>(`/api/v1/location-challenges/admin/events/${eventId}/end/`, {
    method: "POST",
    body: JSON.stringify({ reason: reason ?? "" }),
  })
}

export type EventImageKind =
  | "icon"
  | "image"
  | "banner"
  | "instruction_icon"
  | "sponsor_icon"
  | "badge_icon"

/** Uploads an event icon (max 2 MB), cover image or banner (max 10 MB each) to S3; returns its URL. */
export function uploadEventImage(file: File, kind: EventImageKind): Promise<string> {
  const body = new FormData()
  body.append("file", file)
  body.append("kind", kind)
  return apiRequest<{ kind: EventImageKind; file_url: string }>(
    `/api/v1/location-challenges/admin/uploads/`,
    { method: "POST", body }
  ).then((data) => data.file_url)
}
