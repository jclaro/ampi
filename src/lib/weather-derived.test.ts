import { describe, it, expect } from "vitest";
import { dewPoint } from "./weather-derived";

describe("dewPoint", () => {
  it("a 100% de humidade o ponto de orvalho ≈ temperatura", () => {
    expect(dewPoint(20, 100)).toBe(20);
  });

  it("casa com valores de referência (20°C, 50% → ~9°C)", () => {
    expect(dewPoint(20, 50)).toBe(9);
  });

  it("ar mais seco → ponto de orvalho mais baixo", () => {
    expect(dewPoint(20, 30)!).toBeLessThan(dewPoint(20, 60)!);
  });

  it("devolve null sem dados ou humidade inválida", () => {
    expect(dewPoint(null, 50)).toBeNull();
    expect(dewPoint(20, null)).toBeNull();
    expect(dewPoint(20, 0)).toBeNull();
  });
});
