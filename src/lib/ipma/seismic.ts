import type { SeismicEvent } from "./types";
import { toNumberOrNull } from "./aggregate";
import { ipmaFetch } from "./client";

const REVALIDATE_SEISMIC = 300; // 5 min

/** Áreas sísmicas do IPMA. */
export const SEISMIC_AREAS = {
  continent: 7, // Continente + Madeira
  azores: 3, // Açores
} as const;

interface RawSeismic {
  time: string;
  magnitud: string;
  magType: string;
  depth: number | null;
  obsRegion: string;
  lat: string;
  lon: string;
  sensed: boolean | null;
}

interface RawSeismicResponse {
  data: RawSeismic[];
}

export function parseSeismic(raw: RawSeismicResponse): SeismicEvent[] {
  return raw.data
    .map((e) => ({
      time: e.time,
      magnitude: toNumberOrNull(e.magnitud),
      magType: e.magType,
      depth: toNumberOrNull(e.depth),
      region: e.obsRegion,
      lat: Number(e.lat),
      lon: Number(e.lon),
      felt: e.sensed === true,
    }))
    .sort((a, b) => (a.time < b.time ? 1 : a.time > b.time ? -1 : 0));
}

export async function getSeismic(
  area: number = SEISMIC_AREAS.continent,
): Promise<SeismicEvent[]> {
  const raw = await ipmaFetch<RawSeismicResponse>(
    `/open-data/observation/seismic/${area}.json`,
    { revalidate: REVALIDATE_SEISMIC, tag: `seismic-${area}` },
  );
  return parseSeismic(raw);
}
