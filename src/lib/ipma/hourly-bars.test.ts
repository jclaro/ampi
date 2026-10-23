import { describe, it, expect } from "vitest";
import { hourlyHeights } from "./hourly-bars";
import type { Hourly } from "./types";

function h(temp: number | null): Hourly {
  return {
    date: "2026-10-20T12:00:00",
    temp,
    feelsLike: temp,
    humidity: 50,
    precipitationProb: 0,
    weatherTypeId: 1,
    windSpeed: 5,
    windDir: "N",
    uv: 1,
    sea: null,
  };
}

describe("hourlyHeights", () => {
  it("o mais quente tem altura máxima (100%) e o mais frio a mínima configurada", () => {
    const hs = hourlyHeights([h(10), h(20), h(5)], 40, 100);
    // 5 → 40%, 20 → 100%
    const cold = hs[2];
    const hot = hs[1];
    expect(hot.heightPct).toBe(100);
    expect(cold.heightPct).toBe(40);
  });

  it("interpola valores intermédios na escala comum", () => {
    const hs = hourlyHeights([h(0), h(10), h(20)], 50, 100);
    // 10 é o meio → 75% (entre 50 e 100)
    expect(hs[1].heightPct).toBeCloseTo(75, 0);
  });

  it("temperaturas iguais → todas na altura máxima", () => {
    const hs = hourlyHeights([h(15), h(15)], 40, 100);
    expect(hs[0].heightPct).toBe(100);
  });

  it("temp null → altura mínima, sem rebentar", () => {
    const hs = hourlyHeights([h(10), h(null)], 40, 100);
    expect(hs[1].heightPct).toBe(40);
  });
});
