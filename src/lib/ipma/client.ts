const BASE_URL = "https://api.ipma.pt";

interface FetchOptions {
  /** Janela de revalidação (segundos) — alinhada com a cadência do IPMA. */
  revalidate: number;
  /** Tag de cache do Next, para revalidação dirigida. */
  tag: string;
}

/**
 * Último valor bem-sucedido por path, para fallback quando o IPMA falha.
 * A cache partilhada real (entre utilizadores) é a do Next (`next.revalidate`/`tags`);
 * este mapa é só a rede de segurança de resiliência.
 */
const staleCache = new Map<string, unknown>();

/** Apenas para testes — limpa o cache stale entre casos. */
export function __clearStaleCache(): void {
  staleCache.clear();
}

/**
 * Fetch único para toda a app contra a API pública do IPMA.
 * - O cliente (browser) nunca chama o IPMA diretamente: só o servidor via esta função.
 * - A resposta é cacheada e PARTILHADA entre utilizadores pela fetch cache do Next.
 * - Se o IPMA estiver em baixo, devolve o último valor conhecido (stale) em vez de falhar.
 */
export async function ipmaFetch<T>(
  path: string,
  { revalidate, tag }: FetchOptions,
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      next: { revalidate, tags: [tag] },
    });
    if (!res.ok) {
      throw new Error(`IPMA respondeu ${res.status} para ${path}`);
    }
    const data = (await res.json()) as T;
    staleCache.set(path, data);
    return data;
  } catch (err) {
    const stale = staleCache.get(path);
    if (stale !== undefined) {
      return stale as T;
    }
    throw err;
  }
}
