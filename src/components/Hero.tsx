import type { Hourly, Location } from "@/lib/ipma/types";
import { weatherTypeLabel } from "@/lib/ipma/weather-types";
import { conditionCircleClass } from "@/lib/ipma/condition-color";
import { WeatherIcon } from "./WeatherIcon";
import { temp } from "@/lib/format";

export function Hero({
  location,
  now,
  tMin,
  tMax,
  action,
}: {
  location: Location;
  now: Hourly | undefined;
  tMin: number | null;
  tMax: number | null;
  /** Ação opcional (ex. botão Guardar) junto ao nome do local. */
  action?: React.ReactNode;
}) {
  const condition = now ? weatherTypeLabel(now.weatherTypeId).label : "";
  return (
    <header className="flex flex-col gap-4 px-4 pt-4">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <h1 className="text-center text-3xl font-bold tracking-tight">
          {location.name}
        </h1>
        {action}
      </div>

      {now && (
        <div className="flex items-center justify-center gap-5">
          {/* Círculo de acento com o ícone de condição (estilo Hello Weather) */}
          <div
            data-testid="hero-icon-circle"
            className={`flex h-24 w-24 items-center justify-center rounded-full ${conditionCircleClass(now.weatherTypeId, { date: now.date })}`}
          >
            <WeatherIcon id={now.weatherTypeId} date={now.date} size={76} />
          </div>

          <div className="flex flex-col">
            <span className="text-6xl font-bold tabular-nums leading-none">
              {temp(now.temp)}
            </span>
            {now.feelsLike !== null && (
              <span className="mt-1 text-sm text-slate-500">
                Sensação {temp(now.feelsLike)}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="text-center">
        <p className="text-lg font-medium">{condition}</p>
        <p className="text-sm text-slate-500 tabular-nums">
          Máx {temp(tMax)} · Mín {temp(tMin)}
        </p>
      </div>
    </header>
  );
}
