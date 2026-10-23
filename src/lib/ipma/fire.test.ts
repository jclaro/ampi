import { describe, it, expect } from "vitest";
import { parseFireRisk, dicoFor, fireRiskLabel } from "./fire";
import raw from "./__fixtures__/rcm-d0.json";

describe("dicoFor", () => {
  it("compõe o código dico a partir de distrito e concelho (zero-padded)", () => {
    expect(dicoFor(11, 6)).toBe("1106"); // Lisboa
    expect(dicoFor(1, 1)).toBe("0101"); // Águeda
  });
});

describe("parseFireRisk", () => {
  const map = parseFireRisk(raw);

  it("mapeia dico → nível de risco (1-5)", () => {
    const lisboa = map.get("1106");
    expect(typeof lisboa).toBe("number");
    expect(lisboa).toBeGreaterThanOrEqual(1);
    expect(lisboa).toBeLessThanOrEqual(5);
  });

  it("devolve undefined para dico inexistente", () => {
    expect(map.get("9999")).toBeUndefined();
  });
});

describe("fireRiskLabel", () => {
  it("traduz o nível em rótulo PT", () => {
    expect(fireRiskLabel(1)).toMatch(/Reduzido/i);
    expect(fireRiskLabel(5)).toMatch(/Máximo/i);
  });
});
