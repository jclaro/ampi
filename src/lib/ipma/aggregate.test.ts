import { describe, it, expect } from "vitest";
import { parseAggregate } from "./aggregate";
import raw from "./__fixtures__/aggregate-1110600.json";

describe("parseAggregate", () => {
  const result = parseAggregate(raw as unknown[]);

  it("separa diárias (idPeriodo 24) e horárias (idPeriodo 1)", () => {
    expect(result.daily).toHaveLength(10);
    expect(result.hourly).toHaveLength(71);
  });

  it("normaliza campos da diária (string→number)", () => {
    const first = result.daily[0];
    expect(first.tMin).toBe(12.9);
    expect(first.tMax).toBe(20.1);
    expect(first.weatherTypeId).toBe(5);
    expect(first.windDir).toBe("NW");
    expect(first.precipitationProb).toBe(0);
    // UV vem na entrada diária (iUv), não na horária.
    expect(first.uv).toBe(3.9);
  });

  it("normaliza campos da horária incluindo bloco de mar", () => {
    const h = result.hourly[0];
    expect(h.temp).toBe(12.9);
    expect(h.humidity).toBe(81.2);
    expect(h.feelsLike).toBe(12.0);
    expect(h.windSpeed).toBe(9.0);
    expect(h.sea).not.toBeNull();
    expect(h.sea?.waterTemp).toBe(16.2);
    expect(h.sea?.swell).toBe(1.3);
  });

  it("converte o sentinela -99.0 de precipitação em null", () => {
    const h = result.hourly[0];
    expect(h.precipitationProb).toBeNull();
  });

  it("ordena por data ascendente", () => {
    const dates = result.hourly.map((h) => h.date);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });
});
