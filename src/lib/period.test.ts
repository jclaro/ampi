import { describe, it, expect } from "vitest";
import { periodTitle } from "./period";

describe("periodTitle", () => {
  it("de madrugada/manhã → 'Esta manhã'", () => {
    expect(periodTitle(6)).toBe("Esta manhã");
    expect(periodTitle(11)).toBe("Esta manhã");
  });

  it("à tarde → 'Esta tarde'", () => {
    expect(periodTitle(12)).toBe("Esta tarde");
    expect(periodTitle(17)).toBe("Esta tarde");
  });

  it("à noite → 'Esta noite e amanhã'", () => {
    expect(periodTitle(18)).toBe("Esta noite e amanhã");
    expect(periodTitle(23)).toBe("Esta noite e amanhã");
    expect(periodTitle(3)).toBe("Esta noite e amanhã");
  });
});
