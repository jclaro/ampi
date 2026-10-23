import type { Daily, Hourly, SeaState } from "./types";

/** Sentinela do IPMA para "sem dado". */
const SENTINEL = -99;

/** Converte string numérica do IPMA em number, ou null se ausente/sentinela. */
export function toNumberOrNull(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n) || n === SENTINEL) return null;
  return n;
}

function toStringOrNull(v: unknown): string | null {
  return v === undefined || v === null || v === "" ? null : String(v);
}

interface RawEntry {
  idPeriodo: number;
  dataPrev: string;
  idTipoTempo: number;
  tMin?: string;
  tMax?: string;
  tMed?: string;
  utci?: string;
  hR?: string;
  ffVento?: string;
  ddVento?: string;
  iUv?: string;
  probabilidadePrecipita?: string;
  tempAguaMar?: string;
  ondulacao?: string;
  dirOndulacao?: string;
  periodOndulacao?: string;
  marTotal?: string;
  periodoPico?: string;
}

function parseSea(e: RawEntry): SeaState | null {
  const waterTemp = toNumberOrNull(e.tempAguaMar);
  const swell = toNumberOrNull(e.ondulacao);
  // Localidades não-costeiras não trazem bloco de mar.
  if (waterTemp === null && swell === null) return null;
  return {
    waterTemp,
    swell,
    swellDir: toStringOrNull(e.dirOndulacao),
    swellPeriod: toNumberOrNull(e.periodOndulacao),
    totalSea: toNumberOrNull(e.marTotal),
    peakPeriod: toNumberOrNull(e.periodoPico),
  };
}

function toDaily(e: RawEntry): Daily {
  return {
    date: e.dataPrev,
    tMin: toNumberOrNull(e.tMin),
    tMax: toNumberOrNull(e.tMax),
    precipitationProb: toNumberOrNull(e.probabilidadePrecipita),
    weatherTypeId: e.idTipoTempo,
    windDir: toStringOrNull(e.ddVento),
    uv: toNumberOrNull(e.iUv),
  };
}

function toHourly(e: RawEntry): Hourly {
  return {
    date: e.dataPrev,
    temp: toNumberOrNull(e.tMed),
    feelsLike: toNumberOrNull(e.utci),
    humidity: toNumberOrNull(e.hR),
    precipitationProb: toNumberOrNull(e.probabilidadePrecipita),
    weatherTypeId: e.idTipoTempo,
    windSpeed: toNumberOrNull(e.ffVento),
    windDir: toStringOrNull(e.ddVento),
    uv: toNumberOrNull(e.iUv),
    sea: parseSea(e),
  };
}

const byDate = (a: { date: string }, b: { date: string }) =>
  a.date < b.date ? -1 : a.date > b.date ? 1 : 0;

/**
 * Normaliza o array do endpoint public-data/forecast/aggregate/{id}.json,
 * separando por idPeriodo: 24 = diária, 1 = horária (3 = 3-horária, ignorado no MVP).
 */
export function parseAggregate(raw: unknown[]): {
  daily: Daily[];
  hourly: Hourly[];
} {
  const entries = raw as RawEntry[];
  const daily = entries
    .filter((e) => e.idPeriodo === 24)
    .map(toDaily)
    .sort(byDate);
  const hourly = entries
    .filter((e) => e.idPeriodo === 1)
    .map(toHourly)
    .sort(byDate);
  return { daily, hourly };
}
