import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCards } from "./MetricCards";
import type { Hourly } from "@/lib/ipma/types";

const base: Hourly = {
  date: "2026-10-20T12:00:00",
  temp: 18,
  feelsLike: 17,
  humidity: 65,
  precipitationProb: 10,
  weatherTypeId: 2,
  windSpeed: 12,
  windDir: "NW",
  uv: 4,
  sea: {
    waterTemp: 16,
    swell: 1.3,
    swellDir: "NW",
    swellPeriod: 7,
    totalSea: 1.3,
    peakPeriod: 14,
  },
};

describe("MetricCards", () => {
  it("mostra vento, UV e humidade", () => {
    render(<MetricCards hour={base} />);
    expect(screen.getByText(/Vento/)).toBeInTheDocument();
    expect(screen.getByText(/NW/)).toBeInTheDocument();
    expect(screen.getByText(/UV/)).toBeInTheDocument();
    expect(screen.getByText(/Humidade/)).toBeInTheDocument();
    expect(screen.getByText(/65/)).toBeInTheDocument();
  });

  it("mostra o cartão de mar quando há dados de mar", () => {
    render(<MetricCards hour={base} />);
    expect(screen.getByText(/Mar/)).toBeInTheDocument();
    expect(screen.getByText(/16/)).toBeInTheDocument(); // temp água
  });

  it("omite o cartão de mar em localidades sem dados de mar", () => {
    render(<MetricCards hour={{ ...base, sea: null }} />);
    expect(screen.queryByText(/Água do mar/)).not.toBeInTheDocument();
  });

  it("não mostra cartão para métrica ausente (ex. UV null)", () => {
    render(<MetricCards hour={{ ...base, uv: null }} />);
    expect(screen.queryByText(/Índice UV/)).not.toBeInTheDocument();
  });

  it("posiciona o marcador de UV proporcionalmente ao índice na escala", () => {
    render(<MetricCards hour={{ ...base, uv: 6 }} />);
    const marker = screen.getByTestId("uv-meter");
    // UV 6 numa escala 0–11 → ~55%
    const left = parseFloat(marker.style.left);
    expect(left).toBeGreaterThan(45);
    expect(left).toBeLessThan(65);
  });
});
