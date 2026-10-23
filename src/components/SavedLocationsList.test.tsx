import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

import { SavedLocationsList } from "./SavedLocationsList";
import { addSaved } from "@/lib/saved-locations";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      new Response(JSON.stringify({ temp: 18, weatherTypeId: 1 })),
    ),
  );
});

describe("SavedLocationsList", () => {
  it("mostra estado vazio quando não há cidades guardadas", () => {
    render(<SavedLocationsList />);
    expect(screen.getByText(/Ainda não guardaste/i)).toBeInTheDocument();
  });

  it("lista as cidades guardadas com temperatura", async () => {
    addSaved({ slug: "lisboa", name: "Lisboa" });
    render(<SavedLocationsList />);
    expect(screen.getByText("Lisboa")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText(/18°/)).toBeInTheDocument(),
    );
  });

  it("remove uma cidade da lista", async () => {
    addSaved({ slug: "lisboa", name: "Lisboa" });
    render(<SavedLocationsList />);
    fireEvent.click(screen.getByRole("button", { name: /remover Lisboa/i }));
    await waitFor(() =>
      expect(screen.queryByText("Lisboa")).not.toBeInTheDocument(),
    );
  });
});
