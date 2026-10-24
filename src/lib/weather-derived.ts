/**
 * Grandezas derivadas de outras que o IPMA já dá — não precisam de rede.
 */

/**
 * Ponto de orvalho (°C) a partir da temperatura (°C) e humidade relativa (%),
 * pela aproximação de Magnus-Tetens. É a temperatura a que o ar saturaria;
 * quanto mais perto da temperatura atual, mais "abafado" se sente.
 *
 * Devolve null se faltar algum dado ou a humidade for ≤ 0.
 */
export function dewPoint(
  tempC: number | null,
  humidityPct: number | null,
): number | null {
  if (tempC === null || humidityPct === null || humidityPct <= 0) return null;
  const a = 17.625;
  const b = 243.04; // °C
  const rh = Math.min(100, humidityPct) / 100;
  const gamma = Math.log(rh) + (a * tempC) / (b + tempC);
  const dp = (b * gamma) / (a - gamma);
  return Math.round(dp);
}
