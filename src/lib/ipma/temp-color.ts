/**
 * Cor (HSL) por temperatura absoluta, calibrada para o clima português:
 *   0 °C → azul (matiz 215), 20 °C → amarelo (matiz 55), 38 °C → vermelho (matiz 8).
 * Interpolação em dois segmentos para que a gama de cor seja usada no intervalo
 * comum em Portugal (um dia de 24 °C já aparece alaranjado, não verde).
 */
const COLD = { c: 0, hue: 215 };
const MILD = { c: 20, hue: 55 };
const HOT = { c: 38, hue: 8 };

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function tempColor(celsius: number): string {
  const c = Math.max(COLD.c, Math.min(HOT.c, celsius));
  let hue: number;
  if (c <= MILD.c) {
    const t = (c - COLD.c) / (MILD.c - COLD.c);
    hue = lerp(COLD.hue, MILD.hue, t);
  } else {
    const t = (c - MILD.c) / (HOT.c - MILD.c);
    hue = lerp(MILD.hue, HOT.hue, t);
  }
  return `hsl(${Math.round(hue)} 85% 55%)`;
}
