import { describe, it, expect } from "vitest";
import { sunTimes, formatClock, moonPhase } from "./sun";

// Coimbra
const LAT = 40.21;
const LON = -8.43;

describe("sunTimes", () => {
  it("calcula nascer/pôr-do-sol de Coimbra a 24/10/2026 (≈7:53 → 18:41)", () => {
    const d = new Date("2026-10-24T12:00:00Z");
    const s = sunTimes(d, LAT, LON)!;
    expect(s).not.toBeNull();
    // Tolerância de 2 min face a efemérides de referência.
    expect(Math.abs(s.sunriseMin - (7 * 60 + 53))).toBeLessThanOrEqual(2);
    expect(Math.abs(s.sunsetMin - (18 * 60 + 41))).toBeLessThanOrEqual(2);
  });

  it("dia é mais curto no inverno do que no verão (Coimbra)", () => {
    const winter = sunTimes(new Date("2026-12-21T12:00:00Z"), LAT, LON)!;
    const summer = sunTimes(new Date("2026-06-21T12:00:00Z"), LAT, LON)!;
    expect(summer.daylightHours).toBeGreaterThan(winter.daylightHours);
    expect(winter.daylightHours).toBeGreaterThan(9); // ~9.4h
    expect(summer.daylightHours).toBeLessThan(15.2); // ~15.0h
  });

  it("sol nasce antes de se pôr e daylight bate com a diferença", () => {
    const s = sunTimes(new Date("2026-10-24T12:00:00Z"), LAT, LON)!;
    expect(s.sunriseMin).toBeLessThan(s.sunsetMin);
    const diffHours = (s.sunsetMin - s.sunriseMin) / 60;
    expect(Math.abs(diffHours - s.daylightHours)).toBeLessThan(0.1);
  });
});

describe("formatClock", () => {
  it("formata minutos como H:MM", () => {
    expect(formatClock(473)).toBe("7:53");
    expect(formatClock(1121)).toBe("18:41");
    expect(formatClock(5)).toBe("0:05");
  });
});

describe("moonPhase", () => {
  it("lua cheia de 26/10/2026 é detetada nessa data", () => {
    const m = moonPhase(new Date("2026-10-26T12:00:00Z"));
    expect(m.label).toBe("Lua cheia");
    expect(m.daysToFull).toBeLessThanOrEqual(1);
  });

  it("a 24/10/2026 a lua cheia está a ~2 dias (como no Hello Weather)", () => {
    const m = moonPhase(new Date("2026-10-24T17:00:00Z"));
    expect(m.daysToFull).toBeGreaterThanOrEqual(1);
    expect(m.daysToFull).toBeLessThanOrEqual(3);
  });

  it("deteta a lua nova (fração perto de 0)", () => {
    // Lua nova em 2000-01-06 — a referência.
    const m = moonPhase(new Date("2000-01-06T18:14:00Z"));
    expect(m.label).toBe("Lua nova");
    expect(m.fraction).toBeLessThan(0.05);
  });

  it("fração está sempre em [0,1)", () => {
    for (const d of ["2026-01-01", "2026-06-15", "2027-03-03"]) {
      const f = moonPhase(new Date(`${d}T00:00:00Z`)).fraction;
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThan(1);
    }
  });
});
