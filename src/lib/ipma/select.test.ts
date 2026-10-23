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

const hours: Hourly[] = [
  h("2026-10-20T08:00:00"),
  h("2026-10-20T14:00:00"),
  h("2026-10-20T20:00:00"),
  h("2026-10-21T02:00:00"),
];

describe("upcomingHours", () => {
  it("exclui horas anteriores à hora atual", () => {
    const now = new Date("2026-10-20T15:30:00");
    const result = upcomingHours(hours, now);
    expect(result.map((x) => x.date)).toEqual([
      "2026-10-20T20:00:00",
      "2026-10-21T02:00:00",
    ]);
  });

  it("inclui a hora exatamente igual a agora (ainda é 'próxima')", () => {
    const now = new Date("2026-10-20T14:00:00");
    const result = upcomingHours(hours, now);
    expect(result[0].date).toBe("2026-10-20T14:00:00");
  });

  it("limita ao número máximo de horas pedido", () => {
    const now = new Date("2026-10-20T00:00:00");
    const result = upcomingHours(hours, now, 2);
    expect(result).toHaveLength(2);
    expect(result[0].date).toBe("2026-10-20T08:00:00");
  });

  it("se todas as horas já passaram, devolve lista vazia", () => {
    const now = new Date("2026-10-22T00:00:00");
    expect(upcomingHours(hours, now)).toEqual([]);
  });
});
