import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ipmaFetch, __clearStaleCache } from "./client";

describe("ipmaFetch", () => {
  beforeEach(() => {
    __clearStaleCache();
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("chama o host public-data do IPMA com o path dado", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ ok: true })));

    await ipmaFetch("/public-data/districts.json", {
      revalidate: 3600,
      tag: "districts",
    });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toBe("https://api.ipma.pt/public-data/districts.json");
  });

  it("passa a configuração de cache do Next (revalidate + tags)", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ ok: true })));

    await ipmaFetch("/public-data/x.json", { revalidate: 1800, tag: "x" });

    const init = fetchMock.mock.calls[0][1] as RequestInit & {
      next?: { revalidate: number; tags: string[] };
    };
    expect(init.next).toEqual({ revalidate: 1800, tags: ["x"] });
  });

  it("devolve o JSON parseado", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ hello: "world" })),
    );
    const data = await ipmaFetch<{ hello: string }>("/public-data/x.json", {
      revalidate: 1,
      tag: "x",
    });
    expect(data.hello).toBe("world");
  });

  it("serve valor stale em cache quando o fetch seguinte falha", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    // 1ª chamada: sucesso → popula cache stale
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ v: 1 })),
    );
    const first = await ipmaFetch<{ v: number }>("/public-data/x.json", {
      revalidate: 1,
      tag: "x",
    });
    expect(first.v).toBe(1);

    // 2ª chamada: IPMA em baixo → devolve o último valor em vez de lançar
    fetchMock.mockRejectedValueOnce(new Error("IPMA down"));
    const second = await ipmaFetch<{ v: number }>("/public-data/x.json", {
      revalidate: 1,
      tag: "x",
    });
    expect(second.v).toBe(1);
  });

  it("NÃO serve stale com mais de 6h — propaga o erro", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.spyOn(globalThis, "fetch");

    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ v: 1 })));
    await ipmaFetch("/public-data/x.json", { revalidate: 1, tag: "x" });

    // Avança 6h + 1min: o valor em cache deixa de ser aceitável.
    vi.advanceTimersByTime(6 * 60 * 60 * 1000 + 60_000);

    fetchMock.mockRejectedValueOnce(new Error("IPMA down"));
    await expect(
      ipmaFetch("/public-data/x.json", { revalidate: 1, tag: "x" }),
    ).rejects.toThrow();

    vi.useRealTimers();
  });

  it("lança se o fetch falhar e não houver valor stale", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("IPMA down"));
    await expect(
      ipmaFetch("/public-data/never-seen.json", { revalidate: 1, tag: "n" }),
    ).rejects.toThrow();
  });
});
