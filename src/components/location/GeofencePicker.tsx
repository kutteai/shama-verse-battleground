import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Circle, MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Loader2, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  reverseGeocode,
  searchAddress,
  type GeocodeResult,
} from "@/lib/geocoding";
import {
  MAX_RADIUS_METERS,
  MIN_RADIUS_METERS,
  formatRadius,
  type Geofence,
} from "@/components/location/geofence";

// Bundlers break Leaflet's default marker image paths — point them at the
// imported assets instead.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// The slider covers the common range; larger radii can still be typed.
const SLIDER_MAX_METERS = 50_000;

// Map starts here until the admin picks a place (continental US).
const FALLBACK_CENTER: [number, number] = [39.5, -98.35];
const FALLBACK_ZOOM = 3;

const round6 = (n: number) => Math.round(n * 1e6) / 1e6;

/** Zoom so the whole circle fits comfortably. */
const zoomForRadius = (meters: number) =>
  Math.max(3, Math.min(16, Math.round(15 - Math.log2(Math.max(meters, 50) / 500))));

const MapSync = ({ center, radiusMeters }: { center: [number, number] | null; radiusMeters: number }) => {
  const map = useMap();
  const radiusRef = useRef(radiusMeters);
  radiusRef.current = radiusMeters;

  // The map mounts inside a dialog that animates open; re-measure once visible.
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(t);
  }, [map]);

  // Fly only when a new place is chosen (search, typed coordinates) — not on
  // radius changes, which would snap the view back while the pin is dragged.
  useEffect(() => {
    if (!center) return;
    map.flyTo(center, zoomForRadius(radiusRef.current), { duration: 0.6 });
  }, [map, center]);

  return null;
};

const ClickToPlace = ({ onPick }: { onPick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => onPick(e.latlng.lat, e.latlng.lng),
  });
  return null;
};

interface GeofencePickerProps {
  value: Geofence;
  onChange: (value: Geofence) => void;
  /** Called with a short place name (e.g. "Boston, United States") when an address is picked. */
  onPlaceName?: (name: string) => void;
}

const GeofencePicker = ({ value, onChange, onPlaceName }: GeofencePickerProps) => {
  const [query, setQuery] = useState(value.address);
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [latText, setLatText] = useState(value.latitude?.toString() ?? "");
  const [lngText, setLngText] = useState(value.longitude?.toString() ?? "");
  const [radiusText, setRadiusText] = useState(String(value.radiusMeters));
  // Only animate the map for changes made outside the map itself.
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(
    value.latitude != null && value.longitude != null ? [value.latitude, value.longitude] : null
  );
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => setQuery(value.address), [value.address]);
  useEffect(() => setLatText(value.latitude?.toString() ?? ""), [value.latitude]);
  useEffect(() => setLngText(value.longitude?.toString() ?? ""), [value.longitude]);
  useEffect(() => setRadiusText(String(value.radiusMeters)), [value.radiusMeters]);

  // Debounced address autocomplete.
  useEffect(() => {
    const q = query.trim();
    if (!showResults || q.length < 3 || q === value.address) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        setResults(await searchAddress(q, controller.signal));
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 500);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query, showResults, value.address]);

  const update = (patch: Partial<Geofence>) => onChange({ ...valueRef.current, ...patch });

  const pickResult = (r: GeocodeResult) => {
    update({ enabled: true, address: r.displayName, latitude: r.latitude, longitude: r.longitude });
    setFlyTarget([r.latitude, r.longitude]);
    setShowResults(false);
    setResults([]);
    if (r.placeName) onPlaceName?.(r.placeName);
  };

  // Map drag/click: move the center, then fill in the address for that spot.
  const placeAt = async (lat: number, lng: number) => {
    const latitude = round6(lat);
    const longitude = round6(lng);
    update({ latitude, longitude });
    try {
      const r = await reverseGeocode(latitude, longitude);
      if (r && valueRef.current.latitude === latitude && valueRef.current.longitude === longitude) {
        update({ address: r.displayName });
      }
    } catch {
      // Address is only a label; keep the coordinates even if lookup fails.
    }
  };

  const commitCoordinates = () => {
    const lat = Number(latText);
    const lng = Number(lngText);
    if (latText.trim() === "" || lngText.trim() === "") return;
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) return;
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) return;
    if (lat === value.latitude && lng === value.longitude) return;
    setFlyTarget([round6(lat), round6(lng)]);
    placeAt(lat, lng);
  };

  const commitRadius = (meters: number) => {
    if (!Number.isFinite(meters)) return;
    const clamped = Math.round(Math.min(MAX_RADIUS_METERS, Math.max(MIN_RADIUS_METERS, meters)));
    update({ radiusMeters: clamped });
    setRadiusText(String(clamped));
  };

  const center: [number, number] | null =
    value.latitude != null && value.longitude != null ? [value.latitude, value.longitude] : null;

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label htmlFor="geofence-enabled" className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> Geofence
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Users whose phone is inside the circle join the event. Users without GPS fall back to
            matching the Location text above.
          </p>
        </div>
        <Switch
          id="geofence-enabled"
          checked={value.enabled}
          onCheckedChange={(enabled) => update({ enabled })}
        />
      </div>

      {value.enabled && (
        <>
          <div className="space-y-2">
            <Label htmlFor="geofence-address">Address</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="geofence-address"
                className="pl-8"
                placeholder="Type an address or place, e.g. Boston Common"
                value={query}
                autoComplete="off"
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowResults(true);
                  update({ address: e.target.value });
                }}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 150)}
              />
              {searching && (
                <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {showResults && results.length > 0 && (
                <ul className="absolute z-[1000] mt-1 w-full max-h-60 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                  {results.map((r) => (
                    <li key={`${r.latitude},${r.longitude},${r.displayName}`}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => pickResult(r)}
                      >
                        {r.displayName}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="h-64 w-full overflow-hidden rounded-md border isolate">
            <MapContainer
              center={center ?? FALLBACK_CENTER}
              zoom={center ? zoomForRadius(value.radiusMeters) : FALLBACK_ZOOM}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapSync center={flyTarget} radiusMeters={value.radiusMeters} />
              <ClickToPlace onPick={placeAt} />
              {center && (
                <>
                  <Marker
                    position={center}
                    draggable
                    eventHandlers={{
                      dragend: (e) => {
                        const { lat, lng } = (e.target as L.Marker).getLatLng();
                        placeAt(lat, lng);
                      },
                    }}
                  />
                  <Circle
                    center={center}
                    radius={value.radiusMeters}
                    pathOptions={{ color: "#2563eb", fillOpacity: 0.12 }}
                  />
                </>
              )}
            </MapContainer>
          </div>
          <p className="text-xs text-muted-foreground">
            {center
              ? "Drag the pin or click the map to move the center."
              : "Search an address, click the map, or type coordinates to place the center."}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="geofence-lat" className="text-xs">Latitude</Label>
              <Input
                id="geofence-lat"
                inputMode="decimal"
                placeholder="42.355093"
                value={latText}
                onChange={(e) => setLatText(e.target.value)}
                onBlur={commitCoordinates}
                onKeyDown={(e) => e.key === "Enter" && commitCoordinates()}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="geofence-lng" className="text-xs">Longitude</Label>
              <Input
                id="geofence-lng"
                inputMode="decimal"
                placeholder="-71.065522"
                value={lngText}
                onChange={(e) => setLngText(e.target.value)}
                onBlur={commitCoordinates}
                onKeyDown={(e) => e.key === "Enter" && commitCoordinates()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="geofence-radius">Radius</Label>
              <span className="text-xs text-muted-foreground">{formatRadius(value.radiusMeters)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Slider
                className="flex-1"
                min={MIN_RADIUS_METERS}
                max={SLIDER_MAX_METERS}
                step={50}
                value={[Math.min(value.radiusMeters, SLIDER_MAX_METERS)]}
                onValueChange={([m]) => commitRadius(m)}
              />
              <div className="relative w-32">
                <Input
                  id="geofence-radius"
                  inputMode="numeric"
                  className="pr-7"
                  value={radiusText}
                  onChange={(e) => setRadiusText(e.target.value.replace(/[^\d]/g, ""))}
                  onBlur={() => commitRadius(Number(radiusText))}
                  onKeyDown={(e) => e.key === "Enter" && commitRadius(Number(radiusText))}
                />
                <span className="absolute right-2.5 top-2.5 text-xs text-muted-foreground">m</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {MIN_RADIUS_METERS} m – {formatRadius(MAX_RADIUS_METERS)}. Type larger values than the slider allows.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

/** Read-only map of an event's geofence (detail view). */
export const GeofencePreview = ({
  latitude,
  longitude,
  radiusMeters,
}: {
  latitude: number;
  longitude: number;
  radiusMeters: number;
}) => (
  <div className="h-56 w-full overflow-hidden rounded-md border isolate">
    <MapContainer
      center={[latitude, longitude]}
      zoom={zoomForRadius(radiusMeters)}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapSync center={null} radiusMeters={radiusMeters} />
      <Marker position={[latitude, longitude]} />
      <Circle
        center={[latitude, longitude]}
        radius={radiusMeters}
        pathOptions={{ color: "#2563eb", fillOpacity: 0.12 }}
      />
    </MapContainer>
  </div>
);

export default GeofencePicker;
