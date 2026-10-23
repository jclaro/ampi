import { ipmaFetch } from "./client";
import { toNumberOrNull } from "./aggregate";

const REVALIDATE_OBS = 1800; // 30 min

export interface Observation {
  temp: number | null;
  humidity: number | null;
  pressure: number | null;
  windKmh: number | null;
  windDir: string | null;
  precAccum: number | null;
}

// idDireccVento do IPMA: 0=sem rumo, 1=N … 8=NO, 9=N (volta ao início).
const WIND_DIRS: (string | null)[] = [
  null, // 0
  "N",
  "NE",
  "E",
  "SE",
  "S",
  "SO",
  "O",
  "NO",
  "N", // 9
];

function windDir(id: number | null): string | null {
  if (id === null) return null;
  return WIND_DIRS[id] ?? null;
}

interface RawObs {
  temperatura: number;
  humidade: number;
  pressao: number;
  intensidadeVentoKM: number;
  idDireccVento: number;
  precAcumulada: number;
}

/**
 * Normaliza as observações das estações, usando o timestamp mais recente.
 * Devolve um Map idEstacao → Observation.
 */
export function parseObservations(
  raw: Record<string, unknown>,
): Map<number, Observation> {
  const times = Object.keys(raw).sort();
  const latest = (raw[times[times.length - 1]] ?? {}) as Record<
    string,
    RawObs | null
  >;

  const map = new Map<number, Observation>();
  for (const [id, o] of Object.entries(latest)) {
    if (!o) continue;
    map.set(Number(id), {
      temp: toNumberOrNull(o.temperatura),
      humidity: toNumberOrNull(o.humidade),
      pressure: toNumberOrNull(o.pressao),
      windKmh: toNumberOrNull(o.intensidadeVentoKM),
      windDir: windDir(toNumberOrNull(o.idDireccVento)),
      precAccum: toNumberOrNull(o.precAcumulada),
    });
  }
  return map;
}

export async function getObservations(): Promise<Map<number, Observation>> {
  const raw = await ipmaFetch<Record<string, unknown>>(
    "/open-data/observation/meteorology/stations/observations.json",
    { revalidate: REVALIDATE_OBS, tag: "observations" },
  );
  return parseObservations(raw);
}
