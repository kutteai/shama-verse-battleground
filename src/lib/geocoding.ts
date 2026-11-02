// Address search via OpenStreetMap Nominatim (free, no API key). Its usage
// policy allows light interactive use like this admin form: at most ~1
// request/second, which the picker's 500 ms debounce respects.
const NOMINATIM_URL = "https://nominatim.openstreetmap.org"

export interface GeocodeResult {
  displayName: string
  /** Short "City, Country" style name, used to prefill the event's Location. */
  placeName: string | null
  latitude: number
  longitude: number
}

interface NominatimPlace {
  display_name: string
  lat: string
  lon: string
  address?: Record<string, string>
}

const placeNameFrom = (address?: Record<string, string>): string | null => {
  if (!address) return null
  const city =
    address.city ?? address.town ?? address.village ?? address.hamlet ?? address.county ?? null
  const region = address.country_code === "us" ? address.state : address.country
  return [city, region].filter(Boolean).join(", ") || null
}

const toResult = (p: NominatimPlace): GeocodeResult => ({
  displayName: p.display_name,
  placeName: placeNameFrom(p.address),
  latitude: Math.round(Number(p.lat) * 1e6) / 1e6,
  longitude: Math.round(Number(p.lon) * 1e6) / 1e6,
})

export async function searchAddress(query: string, signal?: AbortSignal): Promise<GeocodeResult[]> {
  const params = new URLSearchParams({ q: query, format: "jsonv2", addressdetails: "1", limit: "6" })
  const res = await fetch(`${NOMINATIM_URL}/search?${params}`, {
    signal,
    headers: { "Accept-Language": "en" },
  })
  if (!res.ok) throw new Error(`Address search failed (${res.status})`)
  const places: NominatimPlace[] = await res.json()
  return places.map(toResult)
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: "jsonv2",
    addressdetails: "1",
  })
  const res = await fetch(`${NOMINATIM_URL}/reverse?${params}`, {
    signal,
    headers: { "Accept-Language": "en" },
  })
  if (!res.ok) return null
  const place: NominatimPlace & { error?: string } = await res.json()
  if (place.error) return null
  return { ...toResult(place), latitude, longitude }
}
