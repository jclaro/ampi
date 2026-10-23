import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { WarningsView } from "./WarningsView";
import type { Warning } from "@/lib/ipma/types";

const warnings: Warning[] = [
  {
    areaId: "LSB",
    type: "Agitação Marítima",
    level: "orange",
    startTime: "2026-10-23T06:00:00",
    endTime: "2026-10-24T00:00:00",
    text: "",
  },
  {
    areaId: "PTO",
    type: "Vento",
    level: "yellow",
    startTime: "2026-10-23T06:00:00",
    endTime: "2026-10-24T00:00:00",
    text: "",
  },
];

const areaBySlug = { lisboa: "LSB", porto: "PTO" };

beforeEach(() => localStorage.clear());

describe("WarningsView", () => {
  it("mostra todos os avisos ativos do país", () => {
    render(<WarningsView warnings={warnings} areaBySlug={areaBySlug} />);
    expect(screen.getByText("Agitação Marítima")).toBeInTheDocument();
    expect(screen.getByText("Vento")).toBeInTheDocument();
  });

  it("destaca 'Na tua zona' quando há localidade guardada com aviso", () => {
    localStorage.setItem("ampi:saved-locations", JSON.stringify([
      { slug: "lisboa", name: "Lisboa" },
    ]));
    render(<WarningsView warnings={warnings} areaBySlug={areaBySlug} />);
    expect(screen.getByText(/Na tua zona/i)).toBeInTheDocument();
  });

  it("não mostra secção local se a zona guardada não tem avisos", () => {
    localStorage.setItem("ampi:saved-locations", JSON.stringify([
      { slug: "faro", name: "Faro" },
    ]));
    render(<WarningsView warnings={warnings} areaBySlug={{ ...areaBySlug, faro: "FAR" }} />);
    expect(screen.queryByText(/Na tua zona/i)).not.toBeInTheDocument();
  });

  it("mostra mensagem quando não há avisos ativos", () => {
    render(<WarningsView warnings={[]} areaBySlug={areaBySlug} />);
    expect(screen.getByText(/Sem avisos/i)).toBeInTheDocument();
  });
});
