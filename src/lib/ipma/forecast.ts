import { ipmaFetch } from "./client";
import { parseLocations, findBySlug } from "./locations";
import { parseAggregate } from "./aggregate";
import type { Daily, Hourly, Location } from "./types";

const REVALIDATE_LOCATIONS = 86400; // 24h — quase estático
const REVALIDATE_FORECAST = 1800; // 30 min — cadência do IPMA

/** Lista leve de localidades para pesquisa/geolocalização no cliente. */
export interface LocationOption {
  name: string;
  slug: string;
  lat: number;
  lon: number;
}

export async function getLocationOptions(): Promise<LocationOption[]> {
  const locations = await getLocations();
  return locations.map((l) => ({
    name: l.name,
    slug: l.slug,
    lat: l.lat,
    lon: l.lon,
  }));
}

export async function getLocations(): Promise<Location[]> {
  const raw = await ipmaFetch<unknown[]>(
    "/public-data/forecast/locations.json",
    { revalidate: REVALIDATE_LOCATIONS, tag: "locations" },
  );
  return parseLocations(raw);
}

export interface LocationForecast {
  location: Location;
  daily: Daily[];
  hourly: Hourly[];
}

/** Carrega localidade + previsão (horária/diária) a partir do slug. */
export async function getForecastBySlug(
  slug: string,
): Promise<LocationForecast | null> {
  const locations = await getLocations();
  const location = findBySlug(locations, slug);
  if (!location) return null;

  const raw = await ipmaFetch<unknown[]>(
    `/public-data/forecast/aggregate/${location.globalIdLocal}.json`,
    { revalidate: REVALIDATE_FORECAST, tag: `forecast-${location.globalIdLocal}` },
  );
  const { daily, hourly } = parseAggregate(raw);
  return { location, daily, hourly };
}
