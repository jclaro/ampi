import { describe, it, expect, beforeEach } from "vitest";
import {
  listSaved,
  addSaved,
  removeSaved,
  setDefault,
  defaultSlug,
  isSaved,
} from "./saved-locations";

beforeEach(() => localStorage.clear());

const lisboa = { slug: "lisboa", name: "Lisboa" };
const porto = { slug: "porto", name: "Porto" };

describe("saved-locations", () => {
  it("começa vazio", () => {
    expect(listSaved()).toEqual([]);
    expect(defaultSlug()).toBeNull();
  });

  it("adiciona cidades e a primeira é a default", () => {
    addSaved(lisboa);
    addSaved(porto);
    expect(listSaved().map((l) => l.slug)).toEqual(["lisboa", "porto"]);
    expect(defaultSlug()).toBe("lisboa");
  });

  it("não duplica a mesma cidade", () => {
    addSaved(lisboa);
    addSaved(lisboa);
    expect(listSaved()).toHaveLength(1);
  });

  it("remove uma cidade", () => {
    addSaved(lisboa);
    addSaved(porto);
    removeSaved("lisboa");
    expect(listSaved().map((l) => l.slug)).toEqual(["porto"]);
    expect(defaultSlug()).toBe("porto");
  });

  it("setDefault move a cidade para o topo", () => {
    addSaved(lisboa);
    addSaved(porto);
    setDefault("porto");
    expect(listSaved().map((l) => l.slug)).toEqual(["porto", "lisboa"]);
    expect(defaultSlug()).toBe("porto");
  });

  it("isSaved indica se a cidade está guardada", () => {
    addSaved(lisboa);
    expect(isSaved("lisboa")).toBe(true);
    expect(isSaved("porto")).toBe(false);
  });

  it("NÃO guarda o último local visto (ampi:last-location) automaticamente", () => {
    // Ver uma localidade (last-location) não a deve pôr em "Os meus locais".
    localStorage.setItem("ampi:last-location", "lisboa");
    expect(listSaved()).toEqual([]);
    expect(isSaved("lisboa")).toBe(false);
  });

  it("só contém locais explicitamente guardados pelo utilizador", () => {
    localStorage.setItem("ampi:last-location", "lisboa"); // visto, não guardado
    addSaved(porto); // guardado pelo utilizador
    expect(listSaved().map((l) => l.slug)).toEqual(["porto"]);
  });
});
