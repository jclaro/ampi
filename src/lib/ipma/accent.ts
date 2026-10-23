import type { Daily } from "./types";

export type AccentTheme = "warm" | "rain" | "cold" | "cloud";

export interface Accent {
  theme: AccentTheme;
  /** Fundo sólido dos cartões horários. */
  solid: string;
  /** Texto sobre o fundo sólido. */
  onSolid: string;
  /** Preenchimento da barra de temperatura. */
  bar: string;
  /** Fundo da pílula de precipitação. */
  pill: string;
}

const PALETTE: Record<AccentTheme, Omit<Accent, "theme">> = {
  warm: {
    solid: "bg-amber-400",
    onSolid: "text-amber-950",
    bar: "bg-amber-400",
    pill: "bg-amber-500 text-white",
  },
  rain: {
    solid: "bg-emerald-500",
    onSolid: "text-white",
    bar: "bg-emerald-500",
    pill: "bg-emerald-600 text-white",
  },
  cold: {
    solid: "bg-sky-500",
    onSolid: "text-white",
    bar: "bg-sky-500",
    pill: "bg-sky-600 text-white",
  },
  cloud: {
    solid: "bg-slate-400",
    onSolid: "text-white",
    bar: "bg-slate-400",
    pill: "bg-slate-500 text-white",
  },
};

/** Categoria de uma condição IPMA (idTipoTempo). */
function category(id: number): AccentTheme {
  if (id === 18 || id === 21 || id === 28 || id === 29 || id === 30)
    return "cold"; // neve/granizo/sleet
  if ((id >= 6 && id <= 15) || id === 19 || id === 20 || id === 23)
    return "rain"; // chuva/aguaceiros/trovoada
  if (id === 1 || id === 2 || id === 3 || id === 5) return "warm"; // limpo/pouco nublado
  return "cloud"; // nublado, nevoeiro, etc.
}

/** Deriva o tema de acento da condição dominante do conjunto de dias. */
export function accentFor(days: Daily[]): Accent {
  if (days.length === 0) return { theme: "cloud", ...PALETTE.cloud };

  const counts: Record<AccentTheme, number> = {
    warm: 0,
    rain: 0,
    cold: 0,
    cloud: 0,
  };
  for (const d of days) counts[category(d.weatherTypeId)]++;

  const theme = (Object.keys(counts) as AccentTheme[]).reduce((best, k) =>
    counts[k] > counts[best] ? k : best,
  );

  return { theme, ...PALETTE[theme] };
}
