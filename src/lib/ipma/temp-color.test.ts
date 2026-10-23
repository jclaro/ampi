import { describe, it, expect } from "vitest";
import { tempColor } from "./temp-color";

function hue(s: string): number {
  return Number(s.match(/hsl\((\d+)/)![1]);
}

describe("tempColor (calibrado para PT: 0=azul, 20=amarelo, 38=vermelho)", () => {
  it("devolve uma cor CSS (hsl)", () => {
    expect(tempColor(15)).toMatch(/^hsl\(/);
  });

  it("0° → azul (matiz ~210+)", () => {
    expect(hue(tempColor(0))).toBeGreaterThan(195);
  });

  it("20° → amarelo (matiz ~45–65)", () => {
    const h = hue(tempColor(20));
    expect(h).toBeGreaterThan(40);
    expect(h).toBeLessThan(70);
  });

  it("24° já saiu do amarelo para laranja (matiz < 50)", () => {
    expect(hue(tempColor(24))).toBeLessThan(50);
  });

  it("38°+ → vermelho (matiz ~0–15)", () => {
    expect(hue(tempColor(38))).toBeLessThan(16);
  });

  it("é monotónica: mais quente → matiz menor", () => {
    expect(hue(tempColor(25))).toBeLessThan(hue(tempColor(10)));
  });

  it("satura nos extremos sem rebentar", () => {
    expect(hue(tempColor(-50))).toBeLessThanOrEqual(240);
    expect(hue(tempColor(80))).toBeGreaterThanOrEqual(0);
  });
});
