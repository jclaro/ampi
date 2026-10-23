/** Normaliza texto para pesquisa: minúsculas, sem acentos. */
function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Pesquisa itens com `name` por texto (sem acentos, case-insensitive).
 * Correspondências por prefixo aparecem antes das correspondências a meio.
 */
export function searchLocations<T extends { name: string }>(
  items: T[],
  query: string,
  max = 8,
): T[] {
  const q = normalize(query);
  if (q === "") return [];

  const prefix: T[] = [];
  const contains: T[] = [];
  for (const item of items) {
    const name = normalize(item.name);
    if (name.startsWith(q)) prefix.push(item);
    else if (name.includes(q)) contains.push(item);
  }
  return [...prefix, ...contains].slice(0, max);
}
