import type { Location } from "./types";

interface RawLocation {
  globalIdLocal: number;
  local: string;
  latitude: string;
  longitude: string;
  idDistrito: number;
  idConcelho: number;
  idAreaAviso: string;
}

/** Converte um nome de localidade em slug URL-safe (sem acentos). */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseLocations(raw: unknown[]): Location[] {
  return (raw as RawLocation[]).map((l) => ({
    globalIdLocal: l.globalIdLocal,
    name: l.local,
    slug: slugify(l.local),
    lat: Number(l.latitude),
    lon: Number(l.longitude),
    districtId: l.idDistrito,
    concelhoId: l.idConcelho,
    warningAreaId: l.idAreaAviso,
  }));
}

export function findBySlug(
  locations: Location[],
  slug: string,
): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
