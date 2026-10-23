/** Arredonda temperatura para inteiro, ou "–" se ausente. */
export function temp(v: number | null): string {
  return v === null ? "–" : `${Math.round(v)}°`;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// `dataPrev` do IPMA é hora local de Portugal; `new Date(iso)` basta.
/** Nome curto do dia da semana a partir de uma data do IPMA. */
export function weekday(iso: string): string {
  return WEEKDAYS[new Date(iso).getDay()];
}

/** Hora "HHh" a partir de uma data do IPMA. */
export function hour(iso: string): string {
  return `${String(new Date(iso).getHours()).padStart(2, "0")}h`;
}

/** Percentagem de precipitação, ou vazio se ausente. */
export function precip(v: number | null): string {
  return v === null ? "" : `${Math.round(v)}%`;
}
