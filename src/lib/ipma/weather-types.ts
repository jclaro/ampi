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
