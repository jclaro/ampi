import type { Daily } from "./types";

export interface TemperatureBar {
  tMin: number | null;
  tMax: number | null;
  /** Posição da extremidade esquerda da barra (%), na escala comum da semana. */
  leftPct: number;
  /** Largura da barra (%), na escala comum. */
  widthPct: number;
}

/** Largura mínima da cápsula de temperatura, para caberem os dois números. */
const TEMP_BAR_MIN_WIDTH = "5.5rem";

/**
 * Posição CSS da cápsula de temperatura dentro da calha. A largura mínima
 * alarga a cápsula para lá da escala, por isso a posição à esquerda é limitada
 * a `100% - mínimo`; caso contrário, a cápsula sai da calha e alarga a página.
 * Em calhas mais estreitas do que o mínimo, a cápsula ocupa a calha toda.
 */
export function temperatureBarPosition(
  bar: Pick<TemperatureBar, "leftPct" | "widthPct">,
): { left: string; width: string; minWidth: string } {
  return {
    left: `max(0px, min(${bar.leftPct}%, 100% - ${TEMP_BAR_MIN_WIDTH}))`,
    width: `${bar.widthPct}%`,
    minWidth: `min(${TEMP_BAR_MIN_WIDTH}, 100%)`,
  };
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
