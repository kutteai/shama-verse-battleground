export interface Geofence {
  enabled: boolean;
  address: string;
  latitude: number | null;
  longitude: number | null;
  radiusMeters: number;
}

export const DEFAULT_RADIUS_METERS = 5000;
export const MIN_RADIUS_METERS = 50;
export const MAX_RADIUS_METERS = 500_000;

export const EMPTY_GEOFENCE: Geofence = {
  enabled: false,
  address: "",
  latitude: null,
  longitude: null,
  radiusMeters: DEFAULT_RADIUS_METERS,
};

export const formatRadius = (meters: number) =>
  meters >= 1000 ? `${(meters / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} km` : `${meters} m`;
