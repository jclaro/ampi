import type { Warning } from "./types";
import { ipmaFetch } from "./client";

const REVALIDATE_WARNINGS = 600; // 10 min — avisos são voláteis

interface RawWarning {
  idAreaAviso: string;
  awarenessTypeName: string;
  awarenessLevelID: string;
  startTime: string;
  endTime: string;
  text: string;
}

interface RawWarningsResponse {
  data: RawWarning[];
}

const LEVELS: Warning["level"][] = ["green", "yellow", "orange", "red"];

function toLevel(id: string): Warning["level"] {
  return (LEVELS as string[]).includes(id)
    ? (id as Warning["level"])
    : "green";
}

export function parseWarnings(raw: RawWarningsResponse): Warning[] {
  return raw.data.map((w) => ({
    areaId: w.idAreaAviso,
    type: w.awarenessTypeName,
    level: toLevel(w.awarenessLevelID),
    startTime: w.startTime,
    endTime: w.endTime,
    text: w.text ?? "",
  }));
}

/** Avisos ativos (nível ≠ verde) para uma área de aviso (idAreaAviso). */
export function activeWarningsForArea(
  warnings: Warning[],
  areaId: string,
): Warning[] {
  return warnings.filter((w) => w.areaId === areaId && w.level !== "green");
}

/** Todos os avisos ativos (nível ≠ verde), qualquer área. */
export function activeWarnings(warnings: Warning[]): Warning[] {
  return warnings.filter((w) => w.level !== "green");
}

export async function getWarnings(): Promise<Warning[]> {
  const raw = await ipmaFetch<RawWarningsResponse>(
    "/public-data/warnings/warnings_www.json",
    { revalidate: REVALIDATE_WARNINGS, tag: "warnings" },
  );
  return parseWarnings(raw);
}
