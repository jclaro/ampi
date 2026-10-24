import type { Hourly } from "@/lib/ipma/types";
import type { WindRange } from "@/lib/ipma/wind-range";
import type { SunTimes, MoonPhase } from "@/lib/sun";
import { formatClock } from "@/lib/sun";
import { dewPoint } from "@/lib/weather-derived";

function uvClass(uv: number): string {
  if (uv < 3) return "Baixo";
  if (uv < 6) return "Moderado";
  if (uv < 8) return "Alto";
  if (uv < 11) return "Muito alto";
  return "Extremo";
}

function Card({
  title,
  value,
  hint,
  children,
}: {
  title: string;
  value: string;
  hint?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </span>
      <span className="text-xl font-semibold tabular-nums">{value}</span>
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
      {children}
    </div>
  );
}

const UV_SCALE_MAX = 11;

// Nº de colunas (desktop) consoante os cartões de métrica presentes — varia
// quando uma métrica não tem dados (ex: Mar no interior). Classes estáticas
// para o Tailwind não as purgar.
const GRID_COLS: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

/** Medidor visual de UV: escala fixa verde→vermelho com marcador na posição. */
function UvMeter({ uv }: { uv: number }) {
  const pct = Math.min(100, (uv / UV_SCALE_MAX) * 100);
  return (
    <span className="relative mt-2 block h-2.5 w-full rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500">
      {/* marcador da posição atual na escala */}
      <span
        data-testid="uv-meter"
        className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-900 shadow dark:border-slate-900 dark:bg-white"
        style={{ left: `${pct}%` }}
      />
    </span>
  );
}

/** Card do nascer/pôr-do-sol, a toda a largura (dois horários + horas de luz). */
function SunCard({ sun, moon }: { sun: SunTimes; moon?: MoonPhase | null }) {
  return (
    <div className="col-span-full flex flex-col gap-3 rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Nascer do sol
          </span>
          <span className="text-xl font-semibold tabular-nums">
            {formatClock(sun.sunriseMin)}
          </span>
        </div>
        <span aria-hidden className="text-2xl text-amber-400">
          ☀
        </span>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Pôr do sol
          </span>
          <span className="text-xl font-semibold tabular-nums">
            {formatClock(sun.sunsetMin)}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-l border-slate-300 pl-3 text-right dark:border-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Luz
          </span>
          <span className="text-xl font-semibold tabular-nums">
            {sun.daylightHours}h
          </span>
        </div>
      </div>
      {moon && (
        <p className="flex items-center gap-2 border-t border-slate-300 pt-3 text-sm text-slate-500 dark:border-slate-700">
          <span aria-hidden className="text-base">
            {moonGlyph(moon.fraction)}
          </span>
          {moon.label}
          {moon.daysToFull > 0 &&
            ` · lua cheia ${moon.daysToFull === 1 ? "amanhã" : `em ${moon.daysToFull} dias`}`}
        </p>
      )}
      <p className="text-[0.6875rem] leading-snug text-slate-400">
        Calculado a partir da data e localização — não é fornecido pelo IPMA.
      </p>
    </div>
  );
}

/** Emoji aproximado da fase lunar a partir da fração do ciclo [0,1). */
function moonGlyph(f: number): string {
  if (f < 0.03 || f >= 0.97) return "🌑";
  if (f < 0.22) return "🌒";
  if (f < 0.28) return "🌓";
  if (f < 0.47) return "🌔";
  if (f < 0.53) return "🌕";
  if (f < 0.72) return "🌖";
  if (f < 0.78) return "🌗";
  return "🌘";
}

export function MetricCards({
  hour,
  wind,
  pressure,
  sun,
  moon,
  fireRisk,
  uv,
}: {
  hour: Hourly;
  /** Intervalo de vento (min–max) ao longo do período; substitui a média. */
  wind?: WindRange | null;
  /** Pressão (hPa) da estação mais próxima; null se indisponível. */
  pressure?: number | null;
  /** Nascer/pôr-do-sol calculado localmente. */
  sun?: SunTimes | null;
  /** Fase da lua calculada localmente. */
  moon?: MoonPhase | null;
  fireRisk?: { level: number; label: string } | null;
  /** UV diário do IPMA (o horário vem null). Fallback para o da hora. */
  uv?: number | null;
}) {
  const uvValue = uv ?? hour.uv;
  const dew = dewPoint(hour.temp, hour.humidity);

  // Só os cartões com dados. O nº presente define as colunas em desktop, para
  // a última linha não ficar com buracos quando uma métrica não existe.
  const cards: React.ReactNode[] = [];
  if (wind)
    cards.push(
      <Card
        key="wind"
        title="Vento"
        value={wind.min === wind.max ? `${wind.max} km/h` : `${wind.min}–${wind.max} km/h`}
        hint={wind.dir ?? undefined}
      />,
    );
  if (uvValue !== null)
    cards.push(
      <Card key="uv" title="Índice UV" value={`${Math.round(uvValue)}`} hint={uvClass(uvValue)}>
        <UvMeter uv={uvValue} />
      </Card>,
    );
  if (hour.humidity !== null)
    cards.push(
      <Card
        key="humidity"
        title="Humidade"
        value={`${Math.round(hour.humidity)}%`}
        hint={dew !== null ? `Orvalho ${dew}°` : undefined}
      />,
    );
  if (pressure != null)
    cards.push(<Card key="pressure" title="Pressão" value={`${pressure} hPa`} />);
  if (hour.sea && hour.sea.waterTemp !== null)
    cards.push(
      <Card
        key="sea"
        title="Mar"
        value={`${Math.round(hour.sea.waterTemp)}°`}
        hint={hour.sea.swell !== null ? `Ondulação ${hour.sea.swell} m` : "Água do mar"}
      />,
    );
  if (fireRisk)
    cards.push(
      <Card
        key="fire"
        title="Risco de incêndio"
        value={fireRisk.label}
        hint={`Nível ${fireRisk.level}/5`}
      />,
    );

  const cols = GRID_COLS[cards.length] ?? "lg:grid-cols-6";

  return (
    <section aria-label="Condições atuais" className="px-4">
      <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${cols}`}>
        {cards}
        {sun && <SunCard sun={sun} moon={moon} />}
      </div>
    </section>
  );
}
