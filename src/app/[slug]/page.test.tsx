import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import aggregateRaw from "@/lib/ipma/__fixtures__/aggregate-1110600.json";
import locationsRaw from "@/lib/ipma/__fixtures__/locations.json";
import fireRaw from "@/lib/ipma/__fixtures__/rcm-d0.json";
import stationsRaw from "@/lib/ipma/__fixtures__/stations.json";
import observationsRaw from "@/lib/ipma/__fixtures__/observations.json";

// Aviso laranja sintético para a área de Lisboa (LSB), para testar o banner.
const warningsRaw = {
  data: [
    {
      reportDate: "2026-10-20T06:00:00",
      text: "Agitação marítima.",
      awarenessTypeName: "Agitação Marítima",
      idAreaAviso: "LSB",
      startTime: "2026-10-20T06:00:00",
      awarenessLevelID: "orange",
      endTime: "2026-10-21T00:00:00",
    },
  ],
};

// Componentes client (search/geolocate) usam o router — mock mínimo.
vi.mock("next/navigation", async () => {
  const actual =
    await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return { ...actual, useRouter: () => ({ push: vi.fn() }) };
});

// Mock do client: devolve as fixtures consoante o path pedido.
vi.mock("@/lib/ipma/client", () => ({
  ipmaFetch: vi.fn(async (path: string) => {
    if (path.includes("/forecast/locations.json")) return locationsRaw;
    if (path.includes("/aggregate/")) return aggregateRaw;
    if (path.includes("/warnings/")) return warningsRaw;
    if (path.includes("/rcm/")) return fireRaw;
    if (path.includes("/stations/stations.json")) return stationsRaw;
    if (path.includes("/stations/observations.json")) return observationsRaw;
    throw new Error(`path não mockado: ${path}`);
  }),
}));

import LocationPage from "./page";

describe("Página /[slug]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Fixa "agora" dentro da janela da fixture (que começa em 2026-10-20T02:00),
    // para que a tira de horas futuras seja determinística.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-20T06:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function renderPage(slug: string) {
    const ui = await LocationPage({ params: Promise.resolve({ slug }) });
    render(ui);
  }

  it("mostra o nome da localidade", async () => {
    await renderPage("lisboa");
    expect(screen.getByText("Lisboa")).toBeInTheDocument();
  });

  it("mostra 5 dias de previsão com máximas e mínimas", async () => {
    await renderPage("lisboa");
    const days = screen.getAllByTestId("daily-row");
    expect(days).toHaveLength(5);
    // 1º dia da fixture: máx 20.1→20° / mín 12.9→13°
    const firstRow = days[0];
    expect(firstRow).toHaveTextContent("20°");
    expect(firstRow).toHaveTextContent("13°");
  });

  it("mostra uma tira horária com pelo menos uma hora", async () => {
    await renderPage("lisboa");
    const hours = screen.getAllByTestId("hourly-cell");
    expect(hours.length).toBeGreaterThan(0);
  });

  it("mostra o banner de aviso em vigor para a área da localidade", async () => {
    await renderPage("lisboa");
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/Aviso/);
    expect(alert).toHaveTextContent("Agitação Marítima");
  });

  it("começa na hora anterior à atual (como o IPMA), não em horas antigas", async () => {
    // Agora = 06:00 UTC = 07:00 em Lisboa (outubro, UTC+1).
    // A tira começa na hora anterior (06h); não deve mostrar 02h/03h antigas como 1ª.
    await renderPage("lisboa");
    const label = screen.getAllByTestId("hour-label")[0].textContent ?? "";
    const hourNum = Number(label.replace("h", ""));
    expect(hourNum).toBeGreaterThanOrEqual(6);
  });
});
