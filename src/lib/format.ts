/** Arredonda temperatura para inteiro, ou "–" se ausente. */
export function temp(v: number | null): string {
  return v === null ? "–" : `${Math.round(v)}°`;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Nome curto do dia da semana a partir de uma data ISO. */
export function weekday(iso: string): string {
  const d = new Date(iso);
  return WEEKDAYS[d.getDay()];
}

/** Hora "HH" a partir de uma data ISO. */
export function hour(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}h`;
}

/** Percentagem de precipitação, ou vazio se ausente. */
export function precip(v: number | null): string {
  return v === null ? "" : `${Math.round(v)}%`;
}
