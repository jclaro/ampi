import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const revalidateTag = vi.fn();
vi.mock("next/cache", () => ({ revalidateTag: (t: string) => revalidateTag(t) }));

import { GET } from "./route";

describe("GET /api/revalidate", () => {
  beforeEach(() => {
    revalidateTag.mockClear();
    process.env.REVALIDATE_SECRET = "s3cr3t";
  });
  afterEach(() => {
    delete process.env.REVALIDATE_SECRET;
  });

  const req = (url: string, headers?: Record<string, string>) =>
    new Request(url, { headers });

  it("500 se o segredo não estiver configurado", async () => {
    delete process.env.REVALIDATE_SECRET;
    const res = await GET(req("https://x/api/revalidate"));
    expect(res.status).toBe(500);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("401 sem segredo correto", async () => {
    const res = await GET(req("https://x/api/revalidate?secret=errado"));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("invalida a tag forecast com o segredo no header", async () => {
    const res = await GET(
      req("https://x/api/revalidate", { "x-revalidate-secret": "s3cr3t" }),
    );
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("forecast");
    expect(await res.json()).toMatchObject({ revalidated: true });
  });

  it("aceita o segredo via query string", async () => {
    const res = await GET(req("https://x/api/revalidate?secret=s3cr3t"));
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("forecast");
  });
});
