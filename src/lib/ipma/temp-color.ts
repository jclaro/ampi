/**
 * Cor (HSL) por temperatura absoluta, calibrada para o clima português:
 *   0 °C → azul (matiz 215), 14 °C → turquesa (matiz 178),
 *   20 °C → amarelo (matiz 55), 38 °C → vermelho (matiz 8).
 * A âncora turquesa intermédia (14 °C) mantém as temperaturas AMENAS comuns em
 * Portugal (8–14 °C) em azul/turquesa em vez de verde: a interpolação de matiz
 * azul→amarelo, se direta, atravessaria a zona verde (matiz ~90–150) justamente
 * nessa gama. Com este ponto, o verde só surge brevemente acima dos 14 °C.
 * Interpolação linear em três segmentos (matiz estritamente decrescente).
 */
const COLD = { c: 0, hue: 215 };
const COOL = { c: 14, hue: 178 };
const MILD = { c: 20, hue: 55 };
const HOT = { c: 38, hue: 8 };

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function tempColor(celsius: number): string {
  const c = Math.max(COLD.c, Math.min(HOT.c, celsius));
  let hue: number;
  if (c <= COOL.c) {
    hue = lerp(COLD.hue, COOL.hue, (c - COLD.c) / (COOL.c - COLD.c));
  } else if (c <= MILD.c) {
    hue = lerp(COOL.hue, MILD.hue, (c - COOL.c) / (MILD.c - COOL.c));
  } else {
    hue = lerp(MILD.hue, HOT.hue, (c - MILD.c) / (HOT.c - MILD.c));
  }
  return `hsl(${Math.round(hue)} 85% 55%)`;
}
