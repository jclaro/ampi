import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";
import type { Hourly, Location } from "@/lib/ipma/types";

const location: Location = {
  globalIdLocal: 1110600,
  name: "Lisboa",
  slug: "lisboa",
  lat: 38.7,
  lon: -9.1,
  districtId: 11,
  concelhoId: 6,
  warningAreaId: "LSB",
};

const now: Hourly = {
  date: "2026-10-20T12:00:00",
  temp: 21,
  feelsLike: 24,
  humidity: 50,
  precipitationProb: 0,
  weatherTypeId: 1,
  windSpeed: 5,
  windDir: "N",
  uv: 3,
  sea: null,
};

function renderHero(overrides: Partial<Hourly> = {}) {
  render(
    <Hero
      location={location}
      now={{ ...now, ...overrides }}
      tMin={13}
      tMax={22}
    />,
  );
}

describe("Hero", () => {
  it("mostra a localidade, temperatura e condição", () => {
    renderHero();
    expect(screen.getByRole("heading", { name: "Lisboa" })).toBeInTheDocument();
    expect(screen.getByText("21°")).toBeInTheDocument();
    expect(screen.getByText("Céu limpo")).toBeInTheDocument();
  });

  it("mostra a sensação térmica (feels like)", () => {
    renderHero();
    expect(screen.getByText(/Sensação 24°/)).toBeInTheDocument();
  });

  it("céu limpo de dia → círculo azul claro", () => {
    renderHero({ date: "2026-10-20T12:00:00", weatherTypeId: 1 });
    expect(screen.getByTestId("hero-icon-circle").className).toMatch(/sky-/);
  });

  it("noite → círculo azul escuro", () => {
    renderHero({ date: "2026-10-20T23:00:00", weatherTypeId: 1 });
    expect(screen.getByTestId("hero-icon-circle").className).toMatch(
      /slate-800|slate-900|indigo-900/,
    );
  });

  it("dia chuvoso → círculo cinzento", () => {
    renderHero({ date: "2026-10-20T12:00:00", weatherTypeId: 6 });
    expect(screen.getByTestId("hero-icon-circle").className).toMatch(
      /slate-4|slate-5|gray-/,
    );
  });
});
