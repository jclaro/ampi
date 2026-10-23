import { ipmaFetch } from "./client";

const REVALIDATE_STATIONS = 86400; // 24h — lista quase estática

export interface Station {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

interface RawStation {
  geometry: { coordinates: [number, number] };
  properties: { idEstacao: number; localEstacao: string };
}

export function parseStations(raw: unknown[]): Station[] {
  return (raw as RawStation[]).map((s) => ({
    id: s.properties.idEstacao,
    name: s.properties.localEstacao,
    lon: s.geometry.coordinates[0],
    lat: s.geometry.coordinates[1],
  }));
}

export async function getStations(): Promise<Station[]> {
  const raw = await ipmaFetch<unknown[]>(
    "/open-data/observation/meteorology/stations/stations.json",
    { revalidate: REVALIDATE_STATIONS, tag: "stations" },
  );
  return parseStations(raw);
}
