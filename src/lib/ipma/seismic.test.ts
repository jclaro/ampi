import { describe, it, expect } from "vitest";
import { parseSeismic } from "./seismic";
import raw from "./__fixtures__/seismic-7.json";

describe("parseSeismic", () => {
  const events = parseSeismic(raw);

  it("normaliza cada sismo com magnitude, região, profundidade e data", () => {
    const e = events[0];
    expect(e).toHaveProperty("magnitude");
    expect(e).toHaveProperty("region");
    expect(e).toHaveProperty("depth");
    expect(e).toHaveProperty("time");
  });

  it("converte o sentinela -99.0 de magnitude em null", () => {
    const sentinel = (raw.data as { magnitud: string }[]).find(
      (x) => x.magnitud === "-99.0",
    );
    expect(sentinel).toBeDefined(); // a fixture tem sentinelas
    expect(events.some((e) => e.magnitude === null)).toBe(true);
  });

  it("ordena do mais recente para o mais antigo", () => {
    for (let i = 1; i < events.length; i++) {
      expect(events[i - 1].time >= events[i].time).toBe(true);
    }
  });

  it("marca se o sismo foi sentido", () => {
    expect(typeof events[0].felt).toBe("boolean");
  });
});
