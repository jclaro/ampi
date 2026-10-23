import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import seismicRaw from "@/lib/ipma/__fixtures__/seismic-7.json";

vi.mock("@/lib/ipma/client", () => ({
  ipmaFetch: vi.fn(async () => seismicRaw),
}));

import SeismicPage from "./page";

describe("Página /sismos", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lista eventos sísmicos com magnitude e região", async () => {
    render(await SeismicPage());
    expect(screen.getByRole("heading", { name: /Sismos/ })).toBeInTheDocument();
    // deve haver pelo menos uma linha de sismo
    expect(screen.getAllByTestId("seismic-row").length).toBeGreaterThan(0);
  });
});
