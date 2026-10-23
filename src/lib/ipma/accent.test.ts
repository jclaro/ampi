import { describe, it, expect } from "vitest";
import { accentFor } from "./accent";
import type { Daily } from "./types";

function day(weatherTypeId: number, tMin = 10, tMax = 20): Daily {
  return {
    date: "2026-10-20T00:00:00",
    tMin,
    tMax,
    precipitationProb: 0,
    weatherTypeId,
    windDir: "N",
  };
}

describe("accentFor", () => {
  it("céu limpo/sol → acento quente (warm)", () => {
    // 1 = céu limpo, 2 = pouco nublado
    expect(accentFor([day(1), day(2), day(1)]).theme).toBe("warm");
  });

  it("chuva dominante → acento de chuva (rain)", () => {
    // 6–15 = chuva/aguaceiros
    expect(accentFor([day(6), day(9), day(10)]).theme).toBe("rain");
  });

  it("neve/muito frio → acento frio (cold)", () => {
    // 18 = neve
    expect(accentFor([day(18, -2, 3)]).theme).toBe("cold");
  });

  it("nublado sem chuva → acento neutro (cloud)", () => {
    // 4 = muito nublado, 27 = nublado
    expect(accentFor([day(4), day(27), day(4)]).theme).toBe("cloud");
  });

  it("expõe classes de cor Tailwind utilizáveis", () => {
    const a = accentFor([day(1)]);
    expect(typeof a.solid).toBe("string"); // fundo sólido do cartão
    expect(typeof a.bar).toBe("string"); // barra
    expect(a.solid.length).toBeGreaterThan(0);
  });

  it("lista vazia não rebenta (devolve cloud por omissão)", () => {
    expect(accentFor([]).theme).toBe("cloud");
  });
});
