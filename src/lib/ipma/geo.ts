/** Distância Haversine (km) entre dois pontos. */
function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Localidade de menor distância às coordenadas dadas. */
export function nearest<T extends { lat: number; lon: number }>(
  items: T[],
  lat: number,
  lon: number,
): T {
  let best = items[0];
  let bestDist = Infinity;
  for (const item of items) {
    const d = haversine(lat, lon, item.lat, item.lon);
    if (d < bestDist) {
      bestDist = d;
      best = item;
    }
  }
  return best;
}
