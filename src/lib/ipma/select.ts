import type { Hourly } from "./types";

/**
 * Horas a partir da hora ANTERIOR à atual (inclusive), como o site do IPMA —
 * que mantém visível a hora recém-terminada (às 17:24 mostra desde as 16h).
 *
 * `dataPrev` do IPMA é hora local de Portugal (sem offset); `now` deve ser
 * "agora em hora de Portugal" (ver `nowInPortugal`).
 */
export function upcomingHours(
  hours: Hourly[],
  now: Date,
  max = 24,
): Hourly[] {
  // Arredonda à hora cheia e recua 1h → inclui a hora anterior à atual.
  const from = new Date(now);
  from.setMinutes(0, 0, 0);
  from.setHours(from.getHours() - 1);
  const fromMs = from.getTime();
  return hours
    .filter((h) => new Date(h.date).getTime() >= fromMs)
    .slice(0, max);
}
