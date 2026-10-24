import type { WeatherType } from "./types";
import classes from "./__fixtures__/weather-type-classe.json";

interface RawWeatherClass {
  idWeatherType: number;
  descWeatherTypePT: string;
  descWeatherTypeEN: string;
}

const byId = new Map<number, string>(
  (classes.data as RawWeatherClass[]).map((c) => [
    c.idWeatherType,
    c.descWeatherTypePT,
  ]),
);

const UNKNOWN_LABEL = byId.get(0) ?? "Sem informação";

/** Mapeia idTipoTempo do IPMA para rótulo PT + slug de ícone. */
export function weatherTypeLabel(id: number): WeatherType {
  const label = byId.get(id);
  if (label === undefined) {
    return { label: UNKNOWN_LABEL, icon: "unknown" };
  }
  return { label, icon: `w-${id}` };
}

/** Condição de chuva/aguaceiros/trovoada (idTipoTempo do IPMA). */
export function isRainy(id: number): boolean {
  return (id >= 6 && id <= 15) || id === 19 || id === 20 || id === 23;
}

/**
 * Condições que justificam o círculo cinzento do ícone: chuva (ver isRainy)
 * mais os restantes casos de precipitação / mau tempo — neblina/nevoeiro (16,
 * 17, 26), neve e aguaceiros de neve (18, 28), granizo (21) e chuva+neve
 * (29, 30). O céu nublado NÃO conta: só o mau tempo fica cinzento.
 */
export function isGreyCondition(id: number): boolean {
  return (
    isRainy(id) ||
    id === 16 ||
    id === 17 ||
    id === 18 ||
    id === 21 ||
    id === 26 ||
    id === 28 ||
    id === 29 ||
    id === 30
  );
}
