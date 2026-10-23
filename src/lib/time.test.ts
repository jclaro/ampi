import { describe, it, expect } from "vitest";
import { nowInPortugal } from "./time";

describe("nowInPortugal", () => {
  it("devolve um Date cujos componentes são a hora de Lisboa", () => {
    // Instante fixo: 2026-06-01T10:00:00Z. Lisboa em junho = UTC+1 → 11h local.
    const instant = new Date("2026-06-01T10:00:00Z");
    const local = nowInPortugal(instant);
    expect(local.getHours()).toBe(11);
    expect(local.getFullYear()).toBe(2026);
    expect(local.getMonth()).toBe(5); // junho (0-indexed)
    expect(local.getDate()).toBe(1);
  });

  it("trata o inverno (UTC+0) corretamente", () => {
    // 2026-01-15T10:00:00Z. Lisboa em janeiro = UTC+0 → 10h local.
    const instant = new Date("2026-01-15T10:00:00Z");
    expect(nowInPortugal(instant).getHours()).toBe(10);
  });
});
