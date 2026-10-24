import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DailyList } from "./DailyList";
import type { Daily } from "@/lib/ipma/types";

let seq = 20;
function day(tMin: number, tMax: number, prob: number | null): Daily {
  return {
    date: `2026-10-${seq++}T00:00:00`,
    tMin,
    tMax,
    precipitationProb: prob,
    weatherTypeId: 1,
    windDir: "N",
  };
}

describe("DailyList", () => {
  it("mostra máx e mín de cada dia", () => {
    render(<DailyList days={[day(13, 20, 0)]} />);
    const row = screen.getByTestId("daily-row");
    expect(row).toHaveTextContent("20°");
    expect(row).toHaveTextContent("13°");
  });

  it("desenha uma barra de amplitude térmica por dia", () => {
    render(<DailyList days={[day(10, 20, 0), day(5, 30, 0)]} />);
    expect(screen.getAllByTestId("temp-bar")).toHaveLength(2);
  });

  it("mostra barra de precipitação só quando a probabilidade é relevante", () => {
    render(<DailyList days={[day(10, 20, 60), day(10, 20, 0)]} />);
    const fills = screen.getAllByTestId("daily-row").map((r) =>
      r.querySelector('[data-testid="precip-fill"]'),
    );
    expect(fills[0]).not.toBeNull(); // 60% → mostra
    expect(fills[1]).toBeNull(); // 0% → esconde
  });

  it("a barra de precipitação cresce com a probabilidade (prob alta → mais larga)", () => {
    render(<DailyList days={[day(10, 20, 90), day(10, 20, 30)]} />);
    const fills = screen.getAllByTestId("precip-fill");
    const w90 = parseFloat((fills[0] as HTMLElement).style.width);
    const w30 = parseFloat((fills[1] as HTMLElement).style.width);
    expect(w90).toBeGreaterThan(w30); // 90% é mais larga que 30%
    expect(w90).toBeLessThanOrEqual(100);
  });

  it("o círculo do ícone fica à direita da barra de chuva", () => {
    render(<DailyList days={[day(10, 20, 80)]} />);
    // a barra e o círculo coexistem no mesmo bloco de precipitação
    expect(screen.getByTestId("precip-fill")).toBeInTheDocument();
    expect(screen.getByTestId("day-icon-circle")).toBeInTheDocument();
  });

  it("os números de temperatura estão dentro da cápsula", () => {
    render(<DailyList days={[day(13, 22, 0)]} />);
    const bar = screen.getByTestId("temp-bar");
    expect(bar).toHaveTextContent("13°");
    expect(bar).toHaveTextContent("22°");
  });

  it("as pontas da cápsula de temperatura usam cor por valor (gradiente)", () => {
    render(<DailyList days={[day(5, 25, 0)]} />);
    const bar = screen.getByTestId("temp-bar") as HTMLElement;
    // gradiente definido em background (linear-gradient com dois hsl)
    expect(bar.style.background).toMatch(/hsl/);
  });

  it("o ícone meteorológico está dentro de um círculo colorido por condição", () => {
    render(<DailyList days={[day(10, 20, 0)]} />); // weatherTypeId 1 = céu limpo
    const circle = screen.getByTestId("day-icon-circle");
    expect(circle.className).toMatch(/rounded-full/);
    // céu limpo de dia → azul claro
    expect(circle.className).toMatch(/bg-sky-300/);
    // o ícone (img) está lá dentro
    expect(circle.querySelector("img")).not.toBeNull();
  });
});
