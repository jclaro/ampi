// Tipos internos normalizados. A app consome SÓ estes tipos, nunca o JSON cru do IPMA.

export interface WeatherType {
  label: string;
  /** slug de ícone (dia/noite resolvidos na UI) */
  icon: string;
}

/** Previsão diária (idPeriodo 24 no agregado). */
export interface Daily {
  date: string; // ISO (dataPrev)
  tMin: number | null;
  tMax: number | null;
  precipitationProb: number | null;
  weatherTypeId: number;
  windDir: string | null;
  uv: number | null; // iUv — só vem na entrada diária
}

/** Previsão horária (idPeriodo 1 no agregado). */
export interface Hourly {
  date: string; // ISO (dataPrev)
  temp: number | null; // tMed
  feelsLike: number | null; // utci
  humidity: number | null; // hR
  precipitationProb: number | null;
  weatherTypeId: number;
  windSpeed: number | null; // ffVento
  windDir: string | null; // ddVento
  uv: number | null; // iUv
  sea: SeaState | null;
}

/** Estado do mar embutido numa hora (só localidades costeiras). */
export interface SeaState {
  waterTemp: number | null; // tempAguaMar
  swell: number | null; // ondulacao
  swellDir: string | null; // dirOndulacao
  swellPeriod: number | null; // periodOndulacao
  totalSea: number | null; // marTotal
  peakPeriod: number | null; // periodoPico
}

export interface Location {
  globalIdLocal: number;
  name: string;
  slug: string;
  lat: number;
  lon: number;
  districtId: number;
  concelhoId: number;
  warningAreaId: string; // idAreaAviso
}

export interface SeismicEvent {
  time: string; // ISO
  magnitude: number | null;
  magType: string;
  depth: number | null;
  region: string;
  lat: number;
  lon: number;
  felt: boolean;
}

export interface Warning {
  areaId: string; // idAreaAviso
  type: string; // awarenessTypeName
  level: "green" | "yellow" | "orange" | "red";
  startTime: string;
  endTime: string;
  text: string;
}
