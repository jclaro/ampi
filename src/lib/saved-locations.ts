const KEY = "ampi:saved-locations";
const LEGACY_KEY = "ampi:last-location";

export interface SavedLocation {
  slug: string;
  name: string;
}

function read(): SavedLocation[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as SavedLocation[];
    // Migração do valor único antigo (só slug — usamos o slug como nome provisório).
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const migrated = [{ slug: legacy, name: capitalize(legacy) }];
      write(migrated);
      return migrated;
    }
    return [];
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

function capitalize(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
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
