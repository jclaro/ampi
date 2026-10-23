import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const orange = {
  reportDate: "2026-10-20T06:00:00",
  text: "Agitação marítima.",
  awarenessTypeName: "Agitação Marítima",
  idAreaAviso: "LSB",
  startTime: "2026-10-20T06:00:00",
  awarenessLevelID: "orange",
  endTime: "2026-10-21T00:00:00",
};
const green = {
  reportDate: "2026-10-20T06:00:00",
  text: "",
  awarenessTypeName: "Vento",
  idAreaAviso: "PTO",
  startTime: "2026-10-20T06:00:00",
  awarenessLevelID: "green",
  endTime: "2026-10-21T00:00:00",
};

let responseData: unknown[] = [];

vi.mock("@/lib/ipma/client", () => ({
  ipmaFetch: vi.fn(async (path: string) => {
    if (path.includes("/warnings/")) return { data: responseData };
    // locations.json → lista de localidades
    return [
      {
        globalIdLocal: 1110600,
        local: "Lisboa",
        latitude: "38.7",
        longitude: "-9.1",
        idDistrito: 11,
        idConcelho: 6,
        idAreaAviso: "LSB",
      },
    ];
  }),
}));

import WarningsPage from "./page";

describe("Página /avisos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("lista apenas avisos ativos (não-verdes)", async () => {
    responseData = [orange, green];
    render(await WarningsPage());
    expect(screen.getAllByText("Agitação Marítima").length).toBeGreaterThan(0);
    expect(screen.queryByText("Vento")).not.toBeInTheDocument();
  });

  it("mostra mensagem quando não há avisos ativos", async () => {
    responseData = [green];
    render(await WarningsPage());
    expect(screen.getByText(/Sem avisos/i)).toBeInTheDocument();
  });
});
