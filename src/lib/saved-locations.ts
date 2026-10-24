const KEY = "ampi:saved-locations";

export interface SavedLocation {
  slug: string;
  name: string;
}

/**
 * Lista de locais GUARDADOS explicitamente pelo utilizador (botão "Guardar").
 * Não inclui o "último local visto" (ampi:last-location) — ver e guardar são
 * coisas distintas.
 */
function read(): SavedLocation[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedLocation[]) : [];
  } catch {
    return [];
  }
}

function write(list: SavedLocation[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // indisponível — ignora
  }
}

export function listSaved(): SavedLocation[] {
  return read();
}

export function addSaved(loc: SavedLocation): void {
  const list = read();
  if (list.some((l) => l.slug === loc.slug)) return;
  write([...list, loc]);
}

export function removeSaved(slug: string): void {
  write(read().filter((l) => l.slug !== slug));
}

/** Move a cidade para o topo (passa a ser a default). */
export function setDefault(slug: string): void {
  const list = read();
  const target = list.find((l) => l.slug === slug);
  if (!target) return;
  write([target, ...list.filter((l) => l.slug !== slug)]);
}

export function defaultSlug(): string | null {
  return read()[0]?.slug ?? null;
}

export function isSaved(slug: string): boolean {
  return read().some((l) => l.slug === slug);
}
