const BASE_URL = "https://api.ipma.pt";

interface FetchOptions {
  /** Janela de revalidação (segundos) — alinhada com a cadência do IPMA. */
  revalidate: number;
  /** Tag(s) de cache do Next, para revalidação dirigida (on-demand). */
  tag: string | string[];
}

/**
 * Idade máxima (ms) de um valor stale que ainda é aceitável servir quando o
 * IPMA falha. 6h: tolera falhas pontuais do IPMA (que republica ~2x/dia) sem
 * nunca mostrar dados de ontem como se fossem atuais. Passado isto, o erro
 * propaga — melhor falhar à vista do que mascarar previsão caduca.
 */
const STALE_MAX_AGE_MS = 6 * 60 * 60 * 1000;

/**
 * Último valor bem-sucedido por path (com o instante em que foi obtido), para
 * fallback quando o IPMA falha. A cache partilhada real (entre utilizadores) é
 * a do Next (`next.revalidate`/`tags`); este mapa é só a rede de resiliência.
 */
const staleCache = new Map<string, { data: unknown; at: number }>();

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
  const tags = Array.isArray(tag) ? tag : [tag];
  try {
    const res = await fetch(url, {
      next: { revalidate, tags },
    });
    if (!res.ok) {
      throw new Error(`IPMA respondeu ${res.status} para ${path}`);
    }
    const data = (await res.json()) as T;
    staleCache.set(path, { data, at: Date.now() });
    return data;
  } catch (err) {
    const stale = staleCache.get(path);
    if (stale !== undefined && Date.now() - stale.at < STALE_MAX_AGE_MS) {
      return stale.data as T;
    }
    throw err;
  }
}
