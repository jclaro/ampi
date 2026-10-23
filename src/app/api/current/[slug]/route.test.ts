import { describe, it, expect, vi, beforeEach } from "vitest";
import aggregateRaw from "@/lib/ipma/__fixtures__/aggregate-1110600.json";
import locationsRaw from "@/lib/ipma/__fixtures__/locations.json";

vi.mock("@/lib/ipma/client", () => ({
  ipmaFetch: vi.fn(async (path: string) => {
    if (path.includes("/locations.json")) return locationsRaw;
    if (path.includes("/aggregate/")) return aggregateRaw;
    throw new Error(`não mockado: ${path}`);
  }),
}));

import { GET } from "./route";

describe("GET /api/current/[slug]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("devolve temperatura e tipo de tempo atuais da localidade", async () => {
    const res = await GET(new Request("http://x/api/current/lisboa"), {
      params: Promise.resolve({ slug: "lisboa" }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.temp).toBe("number");
    expect(typeof body.weatherTypeId).toBe("number");
  });

  it("devolve 404 para slug inexistente", async () => {
    const res = await GET(new Request("http://x/api/current/narnia"), {
      params: Promise.resolve({ slug: "narnia" }),
    });
    expect(res.status).toBe(404);
  });
});
