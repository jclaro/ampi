import { describe, it, expect } from "vitest";
import { searchLocations } from "./search";
import { parseLocations } from "./locations";
import raw from "./__fixtures__/locations.json";

const locations = parseLocations(raw as unknown[]);

describe("searchLocations", () => {
  it("encontra por prefixo, ignorando acentos e maiúsculas", () => {
    const result = searchLocations(locations, "evor");
    expect(result.some((l) => l.name === "Évora")).toBe(true);
  });

  it("encontra 'lisboa' escrito em maiúsculas", () => {
    const result = searchLocations(locations, "LISBOA");
    expect(result[0].name).toBe("Lisboa");
  });

  it("devolve lista vazia para query vazia", () => {
    expect(searchLocations(locations, "")).toEqual([]);
    expect(searchLocations(locations, "   ")).toEqual([]);
  });

  it("limita o número de resultados", () => {
    const result = searchLocations(locations, "a", 5);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it("prioriza correspondências por prefixo sobre correspondências no meio", () => {
    // "porto" deve vir antes de nomes que contêm "porto" a meio.
    const result = searchLocations(locations, "porto");
    expect(result[0].name.toLowerCase().startsWith("porto")).toBe(true);
  });
});
