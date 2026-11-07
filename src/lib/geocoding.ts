// Address search via OpenStreetMap Nominatim (free, no API key). Usage
// policy (https://operations.osmfoundation.org/policies/nominatim/): at most
// 1 request/second and no search-as-you-type autocomplete — so the picker only
// searches when the admin presses Enter or clicks Search.
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
  name?: string
  osm_type?: string
  osm_id?: number
  addresstype?: string
  type?: string
  /** [south, north, west, east] as strings. */
  boundingbox?: [string, string, string, string]
}

/** A searchable area for competitions: its name, type and viewport box. */
export interface PlaceResult {
  placeId: string
  name: string
  displayName: string
  type: string
  neLat: number
  neLng: number
  swLat: number
  swLng: number
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

const round6 = (n: number) => Math.round(n * 1e6) / 1e6

/** Search for areas (countries, cities, islands, regions) with their bounding boxes. */
export async function searchPlaces(query: string, signal?: AbortSignal): Promise<PlaceResult[]> {
  const params = new URLSearchParams({ q: query, format: "jsonv2", addressdetails: "1", limit: "8" })
  const res = await fetch(`${NOMINATIM_URL}/search?${params}`, {
    signal,
    headers: { "Accept-Language": "en" },
  })
  if (!res.ok) throw new Error(`Place search failed (${res.status})`)
  const places: NominatimPlace[] = await res.json()
  return places
    .filter((p) => p.boundingbox && p.osm_type && p.osm_id != null)
    .map((p) => {
      const [south, north, west, east] = p.boundingbox!.map(Number)
      return {
        placeId: `osm:${p.osm_type}/${p.osm_id}`,
        name: p.name || p.display_name.split(",")[0],
        displayName: p.display_name,
        type: p.addresstype || p.type || "place",
        neLat: round6(north),
        neLng: round6(east),
        swLat: round6(south),
        swLng: round6(west),
      }
    })
}
