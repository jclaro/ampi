import { describe, it, expect } from "vitest";
import { weatherTypeLabel, isRainy, isGreyCondition } from "./weather-types";

describe("isRainy", () => {
  it("condições de chuva/aguaceiros/trovoada → true", () => {
    expect(isRainy(6)).toBe(true); // aguaceiros/chuva
    expect(isRainy(10)).toBe(true); // chuvisco
    expect(isRainy(19)).toBe(true); // trovoada
  });
  it("céu limpo/nublado → false", () => {
    expect(isRainy(1)).toBe(false);
    expect(isRainy(4)).toBe(false);
  });
});

describe("isGreyCondition", () => {
  it("mau tempo (chuva, nevoeiro, neve, granizo) → true", () => {
    expect(isGreyCondition(6)).toBe(true); // chuva
    expect(isGreyCondition(17)).toBe(true); // nevoeiro
    expect(isGreyCondition(18)).toBe(true); // neve
    expect(isGreyCondition(21)).toBe(true); // granizo
  });
  it("céu limpo e nublado → false (só mau tempo é cinza)", () => {
    expect(isGreyCondition(1)).toBe(false); // limpo
    expect(isGreyCondition(4)).toBe(false); // muito nublado
    expect(isGreyCondition(27)).toBe(false); // nublado
  });
});

describe("weatherTypeLabel", () => {
  it("devolve a descrição PT e um slug de ícone para um id conhecido", () => {
    // idWeatherType 5 = "Céu nublado por nuvens altas" (fixture IPMA)
    const result = weatherTypeLabel(5);
    expect(result.label).toBe("Céu nublado por nuvens altas");
    expect(result.icon).toBeTruthy();
    expect(typeof result.icon).toBe("string");
  });

  it("devolve a descrição PT para céu limpo (id 1)", () => {
    expect(weatherTypeLabel(1).label).toBe("Céu limpo");
  });

  it("devolve um fallback seguro para um id desconhecido", () => {
    const result = weatherTypeLabel(9999);
    expect(result.label).toBe("Sem informação");
    expect(result.icon).toBe("unknown");
  });
});
