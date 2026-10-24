import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NowDetails } from "./NowDetails";
import type { Hourly } from "@/lib/ipma/types";

const hour: Hourly = {
  date: "2026-10-20T12:00:00",
  temp: 18,
  feelsLike: 17,
  humidity: 65,
  precipitationProb: 10,
  weatherTypeId: 2,
  windSpeed: 12,
  windDir: "NW",
  uv: 4,
  sea: null,
};

describe("NowDetails", () => {
  it("usa <details> para esconder/revelar no mobile", () => {
    const { container } = render(<NowDetails hour={hour} />);
    expect(container.querySelector("details")).not.toBeNull();
  });

  it("tem um resumo acionável 'Mais detalhes'", () => {
    render(<NowDetails hour={hour} />);
    expect(screen.getByText(/Mais detalhes/i)).toBeInTheDocument();
  });

  it("renderiza os cartões de métricas (vento, humidade, UV)", () => {
    render(<NowDetails hour={hour} wind={{ min: 3, max: 7, dir: "NW" }} />);
    expect(screen.getByText(/Vento/)).toBeInTheDocument();
    expect(screen.getByText(/Humidade/)).toBeInTheDocument();
    expect(screen.getByText(/Índice UV/)).toBeInTheDocument();
  });
});
