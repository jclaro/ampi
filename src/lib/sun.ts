/**
 * Nascer e pôr-do-sol calculados localmente (algoritmo NOAA) a partir de
 * lat/lon — o IPMA não publica estes dados. Sem rede, sem dependências.
 *
 * Precisão ao minuto, suficiente para a UI. A hora devolvida é em hora LOCAL
 * de Portugal (Europe/Lisbon), coerente com o resto da app.
 */

const DEG = Math.PI / 180;

export interface SunTimes {
  /** Minutos desde a meia-noite (hora de Lisboa) do nascer do sol. */
  sunriseMin: number;
  /** Minutos desde a meia-noite (hora de Lisboa) do pôr-do-sol. */
  sunsetMin: number;
  /** Duração do dia em horas (ex. 10.8). */
  daylightHours: number;
}

/** Dia juliano às 00:00 UTC da data dada (ano, mês 1-12, dia). */
function julianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    b -
    1524.5
  );
}

/**
 * Offset da timezone Europe/Lisbon (em minutos, +W=0/+1h DST) para um instante.
 * Deriva do próprio Intl para não hardcodar as regras de horário de verão.
 */
function lisbonOffsetMinutes(instant: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Lisbon",
    timeZoneName: "shortOffset",
  }).formatToParts(instant);
  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const m = tz.match(/GMT([+-]\d+)(?::(\d+))?/);
  if (!m) return 0;
  const h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  return h * 60 + Math.sign(h) * min;
}

/**
 * Calcula nascer/pôr-do-sol para uma data e coordenadas.
 * @param date instante de referência (usa-se só o dia-calendário em Lisboa)
 * @param lat latitude (graus, +N)
 * @param lon longitude (graus, +E; Portugal continental é negativo)
 */
export function sunTimes(date: Date, lat: number, lon: number): SunTimes | null {
  // Dia-calendário em Lisboa.
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const year = get("year");
  const month = get("month");
  const day = get("day");

  const jd = julianDay(year, month, day);
  // Número do dia do ciclo solar desde J2000 (arredondado — Wikipedia "Sunrise equation").
  const n = Math.round(jd - 2451545.0 + 0.0008);

  // Mean solar noon (dias desde J2000), ajustado à longitude.
  const Jstar = n - lon / 360;
  const M = (357.5291 + 0.98560028 * Jstar) % 360;
  const Mrad = M * DEG;
  const C =
    1.9148 * Math.sin(Mrad) +
    0.02 * Math.sin(2 * Mrad) +
    0.0003 * Math.sin(3 * Mrad);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambdaRad = lambda * DEG;

  // Solar transit (noon solar, em dias desde J2000)
  const Jtransit =
    2451545.0 +
    Jstar +
    0.0053 * Math.sin(Mrad) -
    0.0069 * Math.sin(2 * lambdaRad);

  // Declinação do sol
  const sinDecl = Math.sin(lambdaRad) * Math.sin(23.4397 * DEG);
  const decl = Math.asin(sinDecl);

  // Ângulo horário para o sol a -0.833° (refração + raio do disco)
  const latRad = lat * DEG;
  const cosH =
    (Math.sin(-0.833 * DEG) - Math.sin(latRad) * sinDecl) /
    (Math.cos(latRad) * Math.cos(decl));

  // Sol nunca nasce / nunca se põe (regiões polares) — não acontece em PT.
  if (cosH > 1 || cosH < -1) return null;

  const H = Math.acos(cosH) / DEG; // graus

  const Jrise = Jtransit - H / 360;
  const Jset = Jtransit + H / 360;

  // J2000 (2451545.0) é meio-dia UTC, por isso a parte fracionária de um dia
  // juliano mede o desvio face ao MEIO-DIA UTC: frac 0 → 12:00 (720 min).
  const toMinutesUtc = (j: number) => {
    const frac = ((j % 1) + 1) % 1; // [0,1)
    return (frac * 1440 + 720) % 1440;
  };

  const offset = lisbonOffsetMinutes(date);
  const sunriseMin = (toMinutesUtc(Jrise) + offset + 1440) % 1440;
  const sunsetMin = (toMinutesUtc(Jset) + offset + 1440) % 1440;

  const daylightHours = ((2 * H) / 360) * 24;

  return {
    sunriseMin: Math.round(sunriseMin),
    sunsetMin: Math.round(sunsetMin),
    daylightHours: Math.round(daylightHours * 10) / 10,
  };
}

/** Formata minutos-desde-a-meia-noite como "H:MM" (ex. 453 → "7:33"). */
export function formatClock(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

const SYNODIC_MONTH = 29.530588853; // dias entre luas novas

export interface MoonPhase {
  /** Fração do ciclo lunar [0,1): 0 = lua nova, 0.5 = lua cheia. */
  fraction: number;
  /** Rótulo PT da fase. */
  label: string;
  /** Dias até à próxima lua cheia (0 se é hoje). */
  daysToFull: number;
}

/**
 * Fase da lua para um instante, por idade lunar a partir de uma lua nova
 * de referência (2000-01-06 18:14 UTC). Precisão de ~1 dia, suficiente para
 * um rótulo ("Lua cheia", "Quarto crescente") no espírito do "Right now".
 */
export function moonPhase(date: Date): MoonPhase {
  const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14) / 86400000; // em dias
  const days = date.getTime() / 86400000;
  const age = (((days - KNOWN_NEW_MOON) % SYNODIC_MONTH) + SYNODIC_MONTH) %
    SYNODIC_MONTH;
  const fraction = age / SYNODIC_MONTH;

  let label: string;
  if (fraction < 0.03 || fraction >= 0.97) label = "Lua nova";
  else if (fraction < 0.22) label = "Lua crescente";
  else if (fraction < 0.28) label = "Quarto crescente";
  else if (fraction < 0.47) label = "Gibosa crescente";
  else if (fraction < 0.53) label = "Lua cheia";
  else if (fraction < 0.72) label = "Gibosa minguante";
  else if (fraction < 0.78) label = "Quarto minguante";
  else label = "Lua minguante";

  // Dias até à próxima lua cheia (fração 0.5). Dentro da janela "Lua cheia"
  // conta como 0 — a lua já está cheia, não daqui a um ciclo inteiro.
  let daysToFull: number;
  if (label === "Lua cheia") {
    daysToFull = 0;
  } else {
    daysToFull = (0.5 - fraction) * SYNODIC_MONTH;
    if (daysToFull < 0) daysToFull += SYNODIC_MONTH;
    daysToFull = Math.round(daysToFull);
  }

  return { fraction, label, daysToFull };
}
