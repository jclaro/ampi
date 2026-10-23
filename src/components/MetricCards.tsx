import type { Hourly } from "@/lib/ipma/types";

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

export function MetricCards({
  hour,
  fireRisk,
  uv,
}: {
  hour: Hourly;
  fireRisk?: { level: number; label: string } | null;
  /** UV diário do IPMA (o horário vem null). Fallback para o da hora. */
  uv?: number | null;
}) {
  const uvValue = uv ?? hour.uv;
  return (
    <section aria-label="Condições atuais" className="px-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {hour.windSpeed !== null && (
          <Card
            title="Vento"
            value={`${Math.round(hour.windSpeed)} km/h`}
            hint={hour.windDir ?? undefined}
          />
        )}
        {uvValue !== null && (
          <Card
            title="Índice UV"
            value={`${Math.round(uvValue)}`}
            hint={uvClass(uvValue)}
          >
            <UvMeter uv={uvValue} />
          </Card>
        )}
        {hour.humidity !== null && (
          <Card title="Humidade" value={`${Math.round(hour.humidity)}%`} />
        )}
        {hour.feelsLike !== null && (
          <Card title="Sensação" value={`${Math.round(hour.feelsLike)}°`} />
        )}
        {hour.sea && hour.sea.waterTemp !== null && (
          <Card
            title="Mar"
            value={`${Math.round(hour.sea.waterTemp)}°`}
            hint={
              hour.sea.swell !== null
                ? `Ondulação ${hour.sea.swell} m`
                : "Água do mar"
            }
          />
        )}
        {fireRisk && (
          <Card
            title="Risco de incêndio"
            value={fireRisk.label}
            hint={`Nível ${fireRisk.level}/5`}
          />
        )}
      </div>
    </section>
  );
}
