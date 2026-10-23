import { describe, it, expect } from "vitest";
import { iconName } from "./weather-icons";

describe("iconName", () => {
  it("céu limpo (1) → clear-day de dia, clear-night de noite", () => {
    expect(iconName(1, false)).toBe("clear-day");
    expect(iconName(1, true)).toBe("clear-night");
  });

  it("céu pouco nublado (2) usa variante dia/noite", () => {
    expect(iconName(2, false)).toBe("partly-cloudy-day");
    expect(iconName(2, true)).toBe("partly-cloudy-night");
  });

  it("chuva (6–10) mapeia para ícones de chuva (sem variante de noite)", () => {
    expect(iconName(6, false)).toMatch(/rain|drizzle/);
    expect(iconName(9, true)).toMatch(/rain|drizzle/);
  });

  it("trovoada mapeia para thunderstorms", () => {
    // idTipoTempo da trovoada no IPMA (verificar na fixture de classes)
    expect(iconName(23, false)).toMatch(/thunder/);
  });

  it("id desconhecido devolve um ícone genérico não vazio", () => {
    expect(iconName(9999, false)).toBeTruthy();
    expect(typeof iconName(9999, false)).toBe("string");
  });
});
