import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import stationsRaw from "@/lib/ipma/__fixtures__/stations.json";
import obsRaw from "@/lib/ipma/__fixtures__/observations.json";

vi.mock("@/lib/ipma/client", () => ({
  ipmaFetch: vi.fn(async (path: string) => {
    if (path.includes("/observations.json")) return obsRaw;
    return stationsRaw;
  }),
}));

// O componente de mapa é client/WebGL — mock para testar só a página.
vi.mock("@/components/MapView", () => ({
  MapView: ({ stations }: { stations: { obs: unknown }[] }) => (
    <div data-testid="map">
      <span data-testid="count">{stations.length}</span>
      <span data-testid="with-obs">
        {stations.filter((p) => p.obs).length}
      </span>
    </div>
  ),
}));

import MapPage from "./page";

describe("Página /mapa", () => {
  beforeEach(() => vi.clearAllMocks());

  it("junta estações e observações e passa ao mapa", async () => {
    render(await MapPage());
    expect(screen.getByRole("heading", { name: /Mapa/ })).toBeInTheDocument();
    expect(screen.getByTestId("count")).toHaveTextContent("227");
    // a maioria das estações tem observação (algumas vêm sem dados/sentinela)
    const withObs = Number(screen.getByTestId("with-obs").textContent);
    expect(withObs).toBeGreaterThan(100);
  });
});
