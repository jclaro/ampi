import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SaveButton } from "./SaveButton";
import { isSaved } from "@/lib/saved-locations";

beforeEach(() => localStorage.clear());

describe("SaveButton", () => {
  it("guarda a localidade ao clicar", () => {
    render(<SaveButton slug="porto" name="Porto" />);
    fireEvent.click(screen.getByRole("button"));
    expect(isSaved("porto")).toBe(true);
  });

  it("alterna para remover quando já está guardada", () => {
    render(<SaveButton slug="porto" name="Porto" />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn); // guarda
    fireEvent.click(btn); // remove
    expect(isSaved("porto")).toBe(false);
  });
});
