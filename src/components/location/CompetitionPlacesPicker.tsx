import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, Rectangle, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, MapPin, Plus, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { searchPlaces, type PlaceResult } from "@/lib/geocoding";
import type { CompetitionPlace } from "@/lib/locationChallengesAdminApi";

const FALLBACK_CENTER: [number, number] = [39.5, -98.35];
const FALLBACK_ZOOM = 3;

const toBounds = (p: CompetitionPlace): L.LatLngBoundsExpression => [
  [p.sw_lat, p.sw_lng],
  [p.ne_lat, p.ne_lng],
];

/** Keeps every place's box in view. */
const FitPlaces = ({ places }: { places: CompetitionPlace[] }) => {
  const map = useMap();

  // The map mounts inside a dialog that animates open; re-measure once visible.
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(t);
  }, [map]);

  useEffect(() => {
    if (places.length === 0) return;
    const bounds = L.latLngBounds(places.flatMap((p) => toBounds(p) as L.LatLngTuple[]));
    map.fitBounds(bounds, { padding: [16, 16] });
  }, [map, places]);

  return null;
};

const PlacesMap = ({ places, height = "h-56" }: { places: CompetitionPlace[]; height?: string }) => (
  <div className={`${height} w-full overflow-hidden rounded-md border isolate`}>
    <MapContainer
      center={FALLBACK_CENTER}
      zoom={FALLBACK_ZOOM}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitPlaces places={places} />
      {places.map((p) => (
        <Rectangle
          key={p.place_id}
          bounds={toBounds(p)}
          pathOptions={{ color: "#2563eb", fillOpacity: 0.12 }}
        />
      ))}
    </MapContainer>
  </div>
);

interface CompetitionPlacesPickerProps {
  value: CompetitionPlace[];
  onChange: (places: CompetitionPlace[]) => void;
}

/**
 * Picks the places that make up a competition area. The area is the union of
 * the places' boxes, so a competition can cover several islands or cities.
 */
const CompetitionPlacesPicker = ({ value, onChange }: CompetitionPlacesPickerProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Explicit search (Enter / button) only: Nominatim's usage policy forbids
  // search-as-you-type autocomplete.
  const runSearch = async () => {
    const q = query.trim();
    if (q.length < 2 || searching) return;
    setSearching(true);
    setError(null);
    try {
      const found = await searchPlaces(q);
      setResults(found);
      if (found.length === 0) setError("No places found. Try a country, city, region or island name.");
    } catch {
      setResults([]);
      setError("Place search failed. Try again.");
    } finally {
      setSearching(false);
    }
  };

  const addPlace = (r: PlaceResult) => {
    if (!value.some((p) => p.place_id === r.placeId)) {
      onChange([
        ...value,
        {
          place_id: r.placeId,
          name: r.name,
          type: r.type,
          ne_lat: r.neLat,
          ne_lng: r.neLng,
          sw_lat: r.swLat,
          sw_lng: r.swLng,
        },
      ]);
    }
    setResults([]);
    setQuery("");
  };

  const removePlace = (placeId: string) => onChange(value.filter((p) => p.place_id !== placeId));

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div>
        <Label htmlFor="competition-place-search" className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" /> Competition area
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          Add one or more places (country, city, region or island). Artists can join while their phone
          is inside any of the boxes on the map.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          id="competition-place-search"
          placeholder="e.g. St. Thomas, then press Enter"
          value={query}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              runSearch();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={runSearch} disabled={searching || query.trim().length < 2}>
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="ml-1.5">Search</span>
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}

      {results.length > 0 && (
        <ul className="max-h-56 overflow-y-auto rounded-md border divide-y">
          {results.map((r) => (
            <li key={r.placeId} className="flex items-center justify-between gap-3 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm">{r.displayName}</p>
                <p className="text-xs text-muted-foreground capitalize">{r.type}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={value.some((p) => p.place_id === r.placeId)}
                onClick={() => addPlace(r)}
              >
                <Plus className="h-4 w-4" />
                <span className="ml-1">Add</span>
              </Button>
            </li>
          ))}
        </ul>
      )}

      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.map((p) => (
            <Badge key={p.place_id} variant="secondary" className="gap-1 py-1 pl-2.5 pr-1 text-xs">
              {p.name}
              <span className="text-muted-foreground capitalize">· {p.type}</span>
              <button
                type="button"
                aria-label={`Remove ${p.name}`}
                className="ml-1 rounded-sm p-0.5 hover:bg-muted-foreground/20"
                onClick={() => removePlace(p.place_id)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No places added yet.</p>
      )}

      <PlacesMap places={value} />
    </div>
  );
};

/** Read-only map of a competition's places (detail view). */
export const CompetitionPlacesPreview = ({ places }: { places: CompetitionPlace[] }) => (
  <PlacesMap places={places} />
);

export default CompetitionPlacesPicker;
