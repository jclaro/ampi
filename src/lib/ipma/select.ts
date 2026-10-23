import type { Hourly } from "./types";

/**
 * Horas a partir de "agora" (inclusive), descartando as que já passaram.
 *
 * Nota: o IPMA entrega `dataPrev` como hora local de Portugal, sem offset.
 * Comparamos ambos os instantes com a mesma interpretação (`Date`), por isso
 * `now` deve ser "agora em hora de Portugal". A página passa a hora correta.
 */
export function upcomingHours(
  hours: Hourly[],
  now: Date,
  max = 24,
): Hourly[] {
  const nowMs = now.getTime();
  return hours
    .filter((h) => new Date(h.date).getTime() >= nowMs)
    .slice(0, max);
}
