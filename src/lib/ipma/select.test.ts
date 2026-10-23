import { describe, it, expect } from "vitest";
import { upcomingHours } from "./select";
import type { Hourly } from "./types";

function h(date: string): Hourly {
  return {
    date,
    temp: 15,
    feelsLike: 15,
    humidity: 50,
    precipitationProb: 0,
    weatherTypeId: 1,
    windSpeed: 5,
    windDir: "N",
    uv: 1,
    sea: null,
  };
}

// Horas consecutivas para testar a "hora em curso".
const hours: Hourly[] = [
  h("2026-10-20T14:00:00"),
  h("2026-10-20T15:00:00"),
  h("2026-10-20T16:00:00"),
  h("2026-10-20T17:00:00"),
];

// `dataPrev` do IPMA é hora LOCAL de Portugal. Como o site oficial, mostramos
// a partir da hora ANTERIOR à atual (a hora recém-terminada ainda fica visível).
describe("upcomingHours", () => {
  it("começa na hora anterior à atual (15:xx → mostra desde as 14h)", () => {
    const now = new Date("2026-10-20T15:40:00");
    const result = upcomingHours(hours, now);
    expect(result.map((x) => x.date)).toEqual([
      "2026-10-20T14:00:00",
      "2026-10-20T15:00:00",
      "2026-10-20T16:00:00",
      "2026-10-20T17:00:00",
    ]);
  });

  it("à hora cheia exata (16:00) também mostra desde a anterior (15h)", () => {
    const now = new Date("2026-10-20T16:00:00");
    expect(upcomingHours(hours, now)[0].date).toBe("2026-10-20T15:00:00");
  });

  it("limita ao número máximo de horas pedido", () => {
    const now = new Date("2026-10-20T16:00:00");
    const result = upcomingHours(hours, now, 2);
    expect(result).toHaveLength(2);
    expect(result[0].date).toBe("2026-10-20T15:00:00");
  });

  it("se todas as horas já passaram, devolve vazio", () => {
    const now = new Date("2026-10-21T23:00:00");
    expect(upcomingHours(hours, now)).toEqual([]);
  });
});
