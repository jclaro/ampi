// Direção de ORIGEM do vento (como o IPMA reporta) em graus de bússola.
const ORIGIN: Record<string, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
  // variantes PT que o IPMA às vezes usa
  NO: 315,
  SO: 225,
};

/**
 * Graus para orientar uma seta que aponta PARA ONDE o vento sopra.
 * (origem + 180°, normalizado a 0–359). Uma seta Lucide "para cima" = 0°.
 */
export function windBearing(dir: string | null): number {
  if (!dir) return 0;
  const origin = ORIGIN[dir.toUpperCase()];
  if (origin === undefined) return 0;
  return (origin + 180) % 360;
}
