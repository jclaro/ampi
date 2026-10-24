import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCards } from "./MetricCards";
import type { Hourly } from "@/lib/ipma/types";
import type { WindRange } from "@/lib/ipma/wind-range";
import type { SunTimes, MoonPhase } from "@/lib/sun";

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

const wind: WindRange = { min: 3, max: 7, dir: "NW" };
const sun: SunTimes = { sunriseMin: 473, sunsetMin: 1121, daylightHours: 10.8 };

describe("MetricCards", () => {
  it("mostra o vento como intervalo min–max com direção", () => {
    render(<MetricCards hour={base} wind={wind} />);
    expect(screen.getByText(/Vento/)).toBeInTheDocument();
    expect(screen.getByText(/3–7 km\/h/)).toBeInTheDocument();
    expect(screen.getByText(/NW/)).toBeInTheDocument();
  });

  it("mostra UV e humidade", () => {
    render(<MetricCards hour={base} />);
    expect(screen.getByText(/Índice UV/)).toBeInTheDocument();
    expect(screen.getByText(/Humidade/)).toBeInTheDocument();
    expect(screen.getByText(/65/)).toBeInTheDocument();
  });

  it("não mostra a sensação (passou para o hero)", () => {
    render(<MetricCards hour={base} />);
    expect(screen.queryByText(/Sensação/)).not.toBeInTheDocument();
  });

  it("mostra a pressão quando há dado", () => {
    render(<MetricCards hour={base} pressure={1028} />);
    expect(screen.getByText(/Pressão/)).toBeInTheDocument();
    expect(screen.getByText(/1028 hPa/)).toBeInTheDocument();
  });

  it("omite a pressão quando não há dado para a zona", () => {
    render(<MetricCards hour={base} pressure={null} />);
    expect(screen.queryByText(/Pressão/)).not.toBeInTheDocument();
  });

  it("mostra o nascer e pôr-do-sol", () => {
    render(<MetricCards hour={base} sun={sun} />);
    expect(screen.getByText(/Nascer do sol/)).toBeInTheDocument();
    expect(screen.getByText("7:53")).toBeInTheDocument();
    expect(screen.getByText(/Pôr do sol/)).toBeInTheDocument();
    expect(screen.getByText("18:41")).toBeInTheDocument();
    expect(screen.getByText(/10.8h/)).toBeInTheDocument();
  });

  it("assinala que o sol/lua não são dados do IPMA", () => {
    render(<MetricCards hour={base} sun={sun} />);
    expect(screen.getByText(/não é fornecido pelo IPMA/)).toBeInTheDocument();
  });

  it("mostra a fase da lua junto ao sol", () => {
    const moon: MoonPhase = {
      fraction: 0.45,
      label: "Gibosa crescente",
      daysToFull: 2,
    };
    render(<MetricCards hour={base} sun={sun} moon={moon} />);
    expect(screen.getByText(/Gibosa crescente/)).toBeInTheDocument();
    expect(screen.getByText(/lua cheia em 2 dias/)).toBeInTheDocument();
  });

  it("mostra o ponto de orvalho como dica na humidade", () => {
    // temp 18, humidade 65 → orvalho ~11°
    render(<MetricCards hour={base} />);
    expect(screen.getByText(/Orvalho/)).toBeInTheDocument();
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
