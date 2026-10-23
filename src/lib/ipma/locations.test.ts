import { describe, it, expect } from "vitest";
import { parseLocations, findBySlug } from "./locations";
import { nearest } from "./geo";
import raw from "./__fixtures__/locations.json";

const locations = parseLocations(raw as unknown[]);

describe("parseLocations", () => {
  it("normaliza cada localidade com slug e coords numéricas", () => {
    const lisboa = locations.find((l) => l.globalIdLocal === 1110600);
    expect(lisboa).toBeDefined();
    expect(lisboa!.name).toBe("Lisboa");
    expect(lisboa!.slug).toBe("lisboa");
    expect(typeof lisboa!.lat).toBe("number");
    expect(typeof lisboa!.lon).toBe("number");
    expect(lisboa!.warningAreaId).toBeTruthy();
  });

  it("gera slugs sem acentos nem espaços", () => {
    const evora = locations.find((l) => l.name === "Évora");
    expect(evora?.slug).toBe("evora");
  });
});

describe("findBySlug", () => {
  it("encontra Lisboa pelo slug", () => {
    expect(findBySlug(locations, "lisboa")?.globalIdLocal).toBe(1110600);
  });

  it("devolve undefined para slug inexistente", () => {
    expect(findBySlug(locations, "narnia")).toBeUndefined();
  });
});

describe("nearest", () => {
  it("devolve a localidade mais próxima de coordenadas dadas", () => {
    const lisboa = locations.find((l) => l.globalIdLocal === 1110600)!;
    // coords quase coincidentes com Lisboa → Lisboa é a mais próxima
    const result = nearest(locations, lisboa.lat + 0.01, lisboa.lon + 0.01);
    expect(result.globalIdLocal).toBe(1110600);
  });
});
