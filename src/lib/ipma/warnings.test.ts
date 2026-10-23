import { describe, it, expect } from "vitest";
import { parseWarnings, activeWarningsForArea } from "./warnings";
import real from "./__fixtures__/warnings_www.json";

// Fixture sintética com avisos de vários níveis (a real só tem 'green').
const synthetic = {
  data: [
    {
      reportDate: "2026-10-20T10:00:00",
      text: "Agitação marítima forte.",
      awarenessTypeName: "Agitação Marítima",
      idAreaAviso: "LSB",
      startTime: "2026-10-20T12:00:00",
      awarenessLevelID: "orange",
      endTime: "2026-10-21T00:00:00",
    },
    {
      reportDate: "2026-10-20T10:00:00",
      text: "",
      awarenessTypeName: "Vento",
      idAreaAviso: "LSB",
      startTime: "2026-10-20T12:00:00",
      awarenessLevelID: "green",
      endTime: "2026-10-21T00:00:00",
    },
    {
      reportDate: "2026-10-20T10:00:00",
      text: "",
      awarenessTypeName: "Trovoada",
      idAreaAviso: "PTO",
      startTime: "2026-10-20T12:00:00",
      awarenessLevelID: "yellow",
      endTime: "2026-10-21T00:00:00",
    },
  ],
};

describe("parseWarnings", () => {
  it("normaliza cada aviso com área, tipo, nível e datas", () => {
    const all = parseWarnings(synthetic);
    expect(all).toHaveLength(3);
    const first = all[0];
    expect(first.areaId).toBe("LSB");
    expect(first.type).toBe("Agitação Marítima");
    expect(first.level).toBe("orange");
    expect(first.startTime).toBe("2026-10-20T12:00:00");
  });

  it("aceita o formato real do IPMA sem erro", () => {
    const all = parseWarnings(real);
    expect(all.length).toBeGreaterThan(0);
  });
});

describe("activeWarningsForArea", () => {
  it("devolve só avisos não-verdes da área pedida", () => {
    const all = parseWarnings(synthetic);
    const active = activeWarningsForArea(all, "LSB");
    expect(active).toHaveLength(1);
    expect(active[0].type).toBe("Agitação Marítima");
    expect(active[0].level).toBe("orange");
  });

  it("devolve vazio quando a área só tem avisos verdes", () => {
    const all = parseWarnings(real); // real é tudo 'green'
    expect(activeWarningsForArea(all, "LSB")).toEqual([]);
  });

  it("não devolve avisos de outras áreas", () => {
    const all = parseWarnings(synthetic);
    const active = activeWarningsForArea(all, "LSB");
    expect(active.every((w) => w.areaId === "LSB")).toBe(true);
  });
});
