import type { Daily } from "./types";

export interface TemperatureBar {
  tMin: number | null;
  tMax: number | null;
  /** Posição da extremidade esquerda da barra (%), na escala comum da semana. */
  leftPct: number;
  /** Largura da barra (%), na escala comum. */
  widthPct: number;
}

/**
 * Calcula, para cada dia, a posição/largura de uma barra de amplitude térmica
 * numa escala COMUM a todos os dias (mín global → 0%, máx global → 100%).
 * Permite comparar dias "ao relance" (estilo Hello Weather).
 */
export function temperatureBars(days: Daily[]): TemperatureBar[] {
  const mins = days.map((d) => d.tMin).filter((v): v is number => v !== null);
  const maxs = days.map((d) => d.tMax).filter((v): v is number => v !== null);

  const globalMin = Math.min(...mins);
  const globalMax = Math.max(...maxs);
  const span = globalMax - globalMin;

  return days.map((d) => {
    if (d.tMin === null || d.tMax === null || span === 0) {
      // Sem dados ou escala degenerada: barra a 0 (evita NaN/divisão por zero).
      return { tMin: d.tMin, tMax: d.tMax, leftPct: 0, widthPct: span === 0 && d.tMin !== null ? 100 : 0 };
    }
    const leftPct = ((d.tMin - globalMin) / span) * 100;
    const widthPct = ((d.tMax - d.tMin) / span) * 100;
    return { tMin: d.tMin, tMax: d.tMax, leftPct, widthPct };
  });
}
