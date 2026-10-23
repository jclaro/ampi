import { describe, it, expect } from "vitest";
import { parseStations } from "./stations";
import raw from "./__fixtures__/stations.json";

describe("parseStations", () => {
  const stations = parseStations(raw as unknown[]);

  it("normaliza cada estação com id, nome e coordenadas", () => {
    const s = stations[0];
    expect(typeof s.id).toBe("number");
    expect(typeof s.name).toBe("string");
    expect(typeof s.lat).toBe("number");
    expect(typeof s.lon).toBe("number");
  });

  it("converte [lon, lat] do GeoJSON para lat/lon separados", () => {
    // fixture: coordinates [-7.821, 37.033] → lon=-7.821, lat=37.033
    const olhao = stations.find((s) => s.name.includes("Olhão"));
    expect(olhao?.lon).toBeCloseTo(-7.821, 2);
    expect(olhao?.lat).toBeCloseTo(37.033, 2);
  });

  it("mantém todas as estações da fixture", () => {
    expect(stations).toHaveLength(227);
  });
});
