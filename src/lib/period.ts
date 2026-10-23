/**
 * Título da tira horária consoante a hora do dia (em Portugal):
 *  manhã (5–11), tarde (12–17), noite (18–4) → "Esta noite e amanhã".
 */
export function periodTitle(hour: number): string {
  if (hour >= 5 && hour < 12) return "Esta manhã";
  if (hour >= 12 && hour < 18) return "Esta tarde";
  return "Esta noite e amanhã";
}
