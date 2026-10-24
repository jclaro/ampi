import type { Hourly } from "./types";

export interface WindRange {
  min: number;
  max: number;
  /** Direção predominante do vento no período (moda das direções horárias). */
  dir: string | null;
}

/**
 * Intervalo de velocidade do vento (km/h) ao longo de um conjunto de horas.
 * A média de vento diz pouco; o intervalo min–max ("3–7 km/h") é mais útil,
 * no espírito do "Right now" do Hello Weather.
 *
 * Devolve null se nenhuma hora tiver velocidade de vento.
 */
export function windRange(hours: Hourly[]): WindRange | null {
  const speeds = hours
    .map((h) => h.windSpeed)
    .filter((v): v is number => v !== null);
  if (speeds.length === 0) return null;

  // Direção predominante: a mais frequente entre as horas com dado.
  const counts = new Map<string, number>();
  for (const h of hours) {
    if (h.windDir) counts.set(h.windDir, (counts.get(h.windDir) ?? 0) + 1);
  }
  let dir: string | null = null;
  let best = 0;
  for (const [d, c] of counts) {
    if (c > best) {
      best = c;
      dir = d;
    }
  }

  return {
    min: Math.round(Math.min(...speeds)),
    max: Math.round(Math.max(...speeds)),
    dir,
  };
}
