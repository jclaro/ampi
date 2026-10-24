import { describe, it, expect } from "vitest";
import { conditionCircleClass } from "./condition-color";

describe("conditionCircleClass", () => {
  it("céu limpo (dia) → azul claro", () => {
    expect(conditionCircleClass(1, { date: "2026-10-20T12:00:00" })).toBe(
      "bg-sky-300",
    );
  });

  it("noite (com date) → azul escuro, mesmo com céu limpo", () => {
    expect(conditionCircleClass(1, { date: "2026-10-20T23:00:00" })).toBe(
      "bg-slate-800",
    );
  });

  it("chuva → cinzento", () => {
    expect(conditionCircleClass(6, { date: "2026-10-20T12:00:00" })).toBe(
      "bg-slate-400",
    );
  });

  it("céu nublado (27) → azul claro, NÃO cinzento (só mau tempo é cinza)", () => {
    expect(conditionCircleClass(27, { date: "2026-10-20T12:00:00" })).toBe(
      "bg-sky-300",
    );
  });

  it("nevoeiro/neve → cinzento (mau tempo)", () => {
    expect(conditionCircleClass(17)).toBe("bg-slate-400"); // nevoeiro
    expect(conditionCircleClass(18)).toBe("bg-slate-400"); // neve
  });

  it("a noite tem prioridade: noite com chuva → azul escuro", () => {
    expect(conditionCircleClass(6, { date: "2026-10-20T23:00:00" })).toBe(
      "bg-slate-800",
    );
  });

  it("sem date: assume dia (céu limpo → azul claro, nunca noite)", () => {
    expect(conditionCircleClass(1)).toBe("bg-sky-300");
  });

  it("sem date: chuva continua cinzento", () => {
    expect(conditionCircleClass(9)).toBe("bg-slate-400");
  });
});
