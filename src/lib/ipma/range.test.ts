import { describe, it, expect } from "vitest";
import { temperatureBars } from "./range";
import type { Daily } from "./types";

function day(tMin: number, tMax: number): Daily {
  return {
    date: "2026-10-20T00:00:00",
    tMin,
    tMax,
    precipitationProb: 0,
    weatherTypeId: 1,
    windDir: "N",
  };
}

describe("temperatureBars", () => {
  it("posiciona cada barra numa escala comum (mín global → 0%, máx global → 100%)", () => {
    const days = [day(10, 20), day(15, 25), day(5, 30)];
    const bars = temperatureBars(days);
    // escala global: 5 → 30 (amplitude 25)
    // dia 0: 10..20 → left (10-5)/25=20%, width (20-10)/25=40%
    expect(bars[0].leftPct).toBeCloseTo(20, 1);
    expect(bars[0].widthPct).toBeCloseTo(40, 1);
    // dia 2: 5..30 → left 0%, width 100%
    expect(bars[2].leftPct).toBeCloseTo(0, 1);
    expect(bars[2].widthPct).toBeCloseTo(100, 1);
  });

  it("mantém os valores tMin/tMax originais em cada barra", () => {
    const days = [day(10, 20)];
    expect(temperatureBars(days)[0].tMin).toBe(10);
    expect(temperatureBars(days)[0].tMax).toBe(20);
  });

  it("lida com dias de tMin/tMax null (ignora-os na escala, barra a 0)", () => {
    const days = [day(10, 20), { ...day(0, 0), tMin: null, tMax: null }];
    const bars = temperatureBars(days);
    expect(bars[1].widthPct).toBe(0);
    // a escala não rebenta por causa do dia nulo
    expect(bars[0].widthPct).toBeGreaterThan(0);
  });

  it("evita divisão por zero quando todos os dias têm a mesma temperatura", () => {
    const days = [day(15, 15), day(15, 15)];
    const bars = temperatureBars(days);
    expect(Number.isNaN(bars[0].leftPct)).toBe(false);
    expect(Number.isNaN(bars[0].widthPct)).toBe(false);
  });
});
