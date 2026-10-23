/**
 * "Agora" em hora de Portugal (Europe/Lisbon), como um Date cujos componentes
 * locais (getHours/getDate/...) correspondem à hora de Lisboa.
 *
 * Isto permite comparar com `dataPrev` do IPMA — que também vem em hora local PT
 * sem offset — de forma consistente, independentemente da timezone do servidor.
 */
export function nowInPortugal(instant: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(instant);

  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);

  // Reconstrói um Date "local" com os componentes de Lisboa.
  return new Date(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") === 24 ? 0 : get("hour"),
    get("minute"),
    get("second"),
  );
}
