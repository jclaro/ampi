import { describe, it, expect } from "vitest";
import { windBearing } from "./wind";

describe("windBearing", () => {
  it("converte pontos cardeais em graus (direção PARA onde sopra)", () => {
    // IPMA dá a direção de origem; a seta aponta para onde o vento vai.
    expect(windBearing("N")).toBe(180); // vem de N → aponta para S
    expect(windBearing("S")).toBe(0);
    expect(windBearing("E")).toBe(270);
    expect(windBearing("W")).toBe(90);
  });

  it("aceita direções compostas (NW, SE…)", () => {
    expect(windBearing("NW")).toBe(135); // vem de NW → aponta para SE
  });

  it("direção desconhecida devolve 0", () => {
    expect(windBearing("X")).toBe(0);
    expect(windBearing(null)).toBe(0);
  });
});
