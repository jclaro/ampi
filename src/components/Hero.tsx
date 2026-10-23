import type { Hourly, Location } from "@/lib/ipma/types";
import { weatherTypeLabel, isRainy } from "@/lib/ipma/weather-types";
import { WeatherIcon } from "./WeatherIcon";
import { temp } from "@/lib/format";

/** Noite entre as 20h e as 7h (hora local da previsão). */
function isNightHour(date: string): boolean {
  const h = new Date(date).getHours();
  return h >= 20 || h < 7;
}

/** Fundo neutro do círculo do Hero, por condição — deixa ver o ícone branco. */
function heroCircleClass(weatherTypeId: number, date: string): string {
  if (isNightHour(date)) return "bg-slate-800"; // noite → azul escuro
  if (isRainy(weatherTypeId)) return "bg-slate-400"; // chuva → cinzento
  if ([1, 2, 3, 5].includes(weatherTypeId)) return "bg-sky-300"; // limpo → azul claro
  return "bg-slate-400"; // nublado/outros → cinzento
}

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
            className={`flex h-24 w-24 items-center justify-center rounded-full ${heroCircleClass(now.weatherTypeId, now.date)}`}
          >
            <WeatherIcon id={now.weatherTypeId} date={now.date} size={68} />
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
