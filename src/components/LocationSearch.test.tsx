import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

import { LocationSearch } from "./LocationSearch";

const options = [
  { name: "Lisboa", slug: "lisboa", lat: 38.72, lon: -9.13 },
  { name: "Porto", slug: "porto", lat: 41.15, lon: -8.61 },
  { name: "Évora", slug: "evora", lat: 38.57, lon: -7.9 },
];

describe("LocationSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("mostra 'Usar a minha localização' como primeira opção ao focar", () => {
    render(<LocationSearch options={options} />);
    fireEvent.focus(screen.getByRole("searchbox"));
    expect(
      screen.getByRole("button", { name: /minha localização/i }),
    ).toBeInTheDocument();
  });

  it("geolocaliza e navega para a localidade mais próxima", async () => {
    const getCurrentPosition = vi.fn((success) =>
      success({ coords: { latitude: 41.1, longitude: -8.6 } }),
    );
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition } });

    render(<LocationSearch options={options} />);
    fireEvent.focus(screen.getByRole("searchbox"));
    fireEvent.click(screen.getByRole("button", { name: /minha localização/i }));
    expect(push).toHaveBeenCalledWith("/porto");
  });

  it("mostra sugestões ao escrever", () => {
    render(<LocationSearch options={options} />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "lis" },
    });
    expect(screen.getByText("Lisboa")).toBeInTheDocument();
    expect(screen.queryByText("Porto")).not.toBeInTheDocument();
  });

  it("ignora acentos na pesquisa", () => {
    render(<LocationSearch options={options} />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "evor" },
    });
    expect(screen.getByText("Évora")).toBeInTheDocument();
  });

  it("navega para a localidade escolhida", () => {
    render(<LocationSearch options={options} />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "porto" },
    });
    fireEvent.click(screen.getByText("Porto"));
    expect(push).toHaveBeenCalledWith("/porto");
  });
});
