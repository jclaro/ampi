/**
 * Mapeia idTipoTempo do IPMA (0–30) para nomes de ícones Meteocons (MIT).
 * Alguns tipos têm variante dia/noite; os de precipitação/nevoeiro não.
 */

type IconFn = (night: boolean) => string;

const dayNight =
  (base: string): IconFn =>
  (night) =>
    `${base}-${night ? "night" : "day"}`;

const fixed =
  (name: string): IconFn =>
  () =>
    name;

const MAP: Record<number, IconFn> = {
  0: fixed("not-available"),
  1: dayNight("clear"),
  2: dayNight("partly-cloudy"),
  3: dayNight("partly-cloudy"),
  4: dayNight("overcast"),
  5: dayNight("partly-cloudy"),
  6: fixed("rain"),
  7: fixed("drizzle"),
  8: fixed("rain"),
  9: fixed("rain"),
  10: fixed("drizzle"),
  11: fixed("rain"),
  12: fixed("rain"),
  13: fixed("drizzle"),
  14: fixed("rain"),
  15: fixed("drizzle"),
  16: fixed("mist"),
  17: fixed("fog"),
  18: fixed("snow"),
  19: fixed("thunderstorms"),
  20: fixed("thunderstorms-day-rain"),
  21: fixed("hail"),
  22: fixed("mist"), // geada: Meteocons não tem "frost"; mist como aproximação
  23: fixed("thunderstorms-rain"),
  24: dayNight("partly-cloudy"),
  25: dayNight("overcast"),
  26: fixed("fog"),
  27: fixed("cloudy"),
  28: fixed("sleet"),
  29: fixed("sleet"),
  30: fixed("sleet"),
};

const FALLBACK = "not-available";

export function iconName(weatherTypeId: number, night: boolean): string {
  const fn = MAP[weatherTypeId];
  return fn ? fn(night) : FALLBACK;
}
