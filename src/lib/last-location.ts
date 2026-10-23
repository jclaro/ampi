const KEY = "ampi:last-location";

/** Guarda o slug da última localidade vista (client-side). */
export function saveLastLocation(slug: string): void {
  try {
    localStorage.setItem(KEY, slug);
  } catch {
    // localStorage indisponível (modo privado, SSR) — ignora.
  }
}

/** Lê o slug da última localidade, ou null. */
export function readLastLocation(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
