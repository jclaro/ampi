import { ipmaFetch } from "./client";
import { parseLocations, findBySlug } from "./locations";
import { parseAggregate } from "./aggregate";
import type { Daily, Hourly, Location } from "./types";

const REVALIDATE_LOCATIONS = 86400; // 24h — quase estático
// TTL alto: a frescura da previsão vem da revalidação on-demand por tag
// (ver /api/revalidate + scheduled function), não da expiração deste TTL.
// O IPMA só republica ~2x/dia, por isso 6h é um fallback seguro caso o cron
// falhe, sem martelar a API.
const REVALIDATE_FORECAST = 21600; // 6h — só fallback; invalidação é on-demand

/** Tag partilhada por TODAS as previsões — permite invalidar tudo de uma vez. */
export const FORECAST_TAG = "forecast";

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
    {
      revalidate: REVALIDATE_FORECAST,
      tag: [`forecast-${location.globalIdLocal}`, FORECAST_TAG],
    },
  );
  const { daily, hourly } = parseAggregate(raw);
  return { location, daily, hourly };
}
