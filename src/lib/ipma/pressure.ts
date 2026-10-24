import type { Station } from "./stations";
import type { Observation } from "./observations";

/** Distância Haversine (km) — duplicada aqui para não exportar a de geo.ts. */
function distKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Acima deste raio não vale a pena atribuir a pressão à localidade. */
const MAX_DIST_KM = 60;

/**
 * Pressão atmosférica (hPa) na estação mais próxima da localidade QUE TENHA
 * leitura válida — nem todas as estações medem pressão. O IPMA não dá pressão
 * na previsão, só nas observações; por isso usamos a estação vizinha.
 *
 * Devolve null se não houver estação com pressão dentro de MAX_DIST_KM.
 */
export function nearestPressure(
  stations: Station[],
  observations: Map<number, Observation>,
  lat: number,
  lon: number,
): number | null {
  let best: number | null = null;
  let bestDist = MAX_DIST_KM;
  for (const s of stations) {
    const obs = observations.get(s.id);
    if (!obs || obs.pressure === null) continue;
    const d = distKm(lat, lon, s.lat, s.lon);
    if (d < bestDist) {
      bestDist = d;
      best = obs.pressure;
    }
  }
  return best === null ? null : Math.round(best);
}
