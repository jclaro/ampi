import { ipmaFetch } from "./client";

const REVALIDATE_FIRE = 3600; // 1h

interface RawFireResponse {
  local: Record<string, { data: { rcm: number } }>;
}

const LABELS: Record<number, string> = {
  1: "Reduzido",
  2: "Moderado",
  3: "Elevado",
  4: "Muito elevado",
  5: "Máximo",
};

/** Código `dico` = distrito (2 díg.) + concelho (2 díg.), zero-padded. */
export function dicoFor(districtId: number, concelhoId: number): string {
  return `${String(districtId).padStart(2, "0")}${String(concelhoId).padStart(2, "0")}`;
}

export function fireRiskLabel(level: number): string {
  return LABELS[level] ?? "Sem informação";
}

/** Mapa dico → nível de risco de incêndio (1-5). */
export function parseFireRisk(raw: RawFireResponse): Map<string, number> {
  const map = new Map<string, number>();
  for (const [dico, entry] of Object.entries(raw.local)) {
    map.set(dico, entry.data.rcm);
  }
  return map;
}

export async function getFireRisk(day = 0): Promise<Map<string, number>> {
  const raw = await ipmaFetch<RawFireResponse>(
    `/open-data/forecast/meteorology/rcm/rcm-d${day}.json`,
    { revalidate: REVALIDATE_FIRE, tag: `fire-d${day}` },
  );
  return parseFireRisk(raw);
}
