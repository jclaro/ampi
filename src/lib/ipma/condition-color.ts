import { isGreyCondition } from "./weather-types";

/** Noite entre as 20h e as 7h (hora local da previsão). */
function isNightHour(date: string): boolean {
  const h = new Date(date).getHours();
  return h >= 20 || h < 7;
}

/**
 * Classe Tailwind de fundo do círculo do ícone, por condição meteorológica —
 * neutro o suficiente para o ícone branco se destacar. Partilhado entre o Hero
 * e a lista "Esta semana" (DailyList).
 *
 * Noite → azul escuro · mau tempo (chuva, neve, granizo, nevoeiro) → cinzento ·
 * dia (céu limpo ou nublado) → azul claro. A noite tem prioridade: de noite o
 * círculo é sempre azul escuro, mesmo com chuva. O céu nublado NÃO fica cinzento.
 * `date` é opcional: sem ele assume-se dia (a previsão diária não tem hora).
 */
export function conditionCircleClass(
  weatherTypeId: number,
  opts?: { date?: string },
): string {
  if (opts?.date && isNightHour(opts.date)) return "bg-slate-800"; // noite
  if (isGreyCondition(weatherTypeId)) return "bg-slate-400"; // mau tempo
  return "bg-sky-300"; // céu limpo ou nublado
}
