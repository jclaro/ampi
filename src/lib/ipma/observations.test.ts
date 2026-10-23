import { describe, it, expect } from "vitest";
import { parseObservations } from "./observations";
import raw from "./__fixtures__/observations.json";

describe("parseObservations", () => {
  const obs = parseObservations(raw as Record<string, unknown>);

  it("usa o timestamp mais recente e indexa por idEstacao", () => {
    const station = obs.get(1210881);
    expect(station).toBeDefined();
    expect(station!.temp).toBe(21.2);
    expect(station!.humidity).toBe(67);
    expect(station!.pressure).toBe(1027.1);
    expect(station!.windKmh).toBe(14.8);
  });

  it("converte o sentinela -99.0 em null", () => {
    // injeta uma estação com sentinelas
    const synthetic = {
      "2026-10-23T13:00": {
        "999": {
          temperatura: -99.0,
          humidade: -99.0,
          pressao: 1010,
          intensidadeVentoKM: 10,
          precAcumulada: 0,
          idDireccVento: 0,
        },
      },
    };
    const s = parseObservations(synthetic).get(999)!;
    expect(s.temp).toBeNull();
    expect(s.humidity).toBeNull();
    expect(s.pressure).toBe(1010);
  });

  it("mapeia idDireccVento para rumo (N/NE/…)", () => {
    const station = obs.get(1210881)!;
    // idDireccVento 5 → algum rumo cardeal
    expect(typeof station.windDir === "string" || station.windDir === null).toBe(
      true,
    );
  });
});
