import type { Hourly } from "./types";

export interface HourlyHeight {
  hour: Hourly;
  /** Altura do cartão (%), entre minPct (mais frio) e 100 (mais quente). */
  heightPct: number;
}

/**
 * Altura de cada cartão horário proporcional à temperatura, numa escala comum,
 * dando o "perfil" visual da tarde (estilo Hello Weather).
 * @param minPct altura mínima (para a temperatura mais fria), ex. 40
 * @param maxPct altura máxima (para a mais quente), ex. 100
 */
export function hourlyHeights(
  hours: Hourly[],
  minPct = 40,
  maxPct = 100,
): HourlyHeight[] {
  const temps = hours
    .map((h) => h.temp)
    .filter((t): t is number => t !== null);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const span = max - min;

  return hours.map((hour) => {
    if (hour.temp === null) return { hour, heightPct: minPct };
    if (span === 0) return { hour, heightPct: maxPct };
    const ratio = (hour.temp - min) / span;
    return { hour, heightPct: minPct + ratio * (maxPct - minPct) };
  });
}
