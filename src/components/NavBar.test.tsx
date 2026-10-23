import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  usePathname: () => "/mapa",
}));

import { NavBar } from "./NavBar";

describe("NavBar", () => {
  it("mostra ligações para as secções principais", () => {
    render(<NavBar />);
    expect(screen.getByRole("link", { name: /Hoje/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Mapa/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Avisos/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sismos/ })).toBeInTheDocument();
  });

  it("marca a secção atual como ativa (aria-current)", () => {
    render(<NavBar />);
    const mapa = screen.getByRole("link", { name: /Mapa/ });
    expect(mapa).toHaveAttribute("aria-current", "page");
  });
});
