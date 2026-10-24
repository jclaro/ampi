import { describe, it, expect } from "vitest";
import { windRange } from "./wind-range";
import type { Hourly } from "./types";

function h(windSpeed: number | null, windDir: string | null): Hourly {
  return {
    date: "2026-10-24T12:00:00",
    temp: 15,
    feelsLike: 14,
    humidity: 50,
    precipitationProb: 0,
    weatherTypeId: 1,
    windSpeed,
    windDir,
    uv: null,
    sea: null,
  };
}

describe("windRange", () => {
  it("devolve o min e o max das velocidades", () => {
    const r = windRange([h(10, "N"), h(25, "NO"), h(18, "N")])!;
    expect(r.min).toBe(10);
    expect(r.max).toBe(25);
  });

  it("direção predominante é a mais frequente", () => {
    const r = windRange([h(10, "N"), h(12, "NO"), h(8, "N")])!;
    expect(r.dir).toBe("N");
  });

  it("ignora horas sem velocidade", () => {
    const r = windRange([h(null, "N"), h(20, "S"), h(null, null)])!;
    expect(r.min).toBe(20);
    expect(r.max).toBe(20);
  });

  it("arredonda as velocidades", () => {
    const r = windRange([h(10.4, "N"), h(24.6, "N")])!;
    expect(r.min).toBe(10);
    expect(r.max).toBe(25);
  });

  it("devolve null sem dados de vento", () => {
    expect(windRange([h(null, "N")])).toBeNull();
    expect(windRange([])).toBeNull();
  });
});
