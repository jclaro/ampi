import type { Daily } from "@/lib/ipma/types";
import { WeatherIcon } from "./WeatherIcon";
import { temp, weekday, precip } from "@/lib/format";
import { temperatureBars } from "@/lib/ipma/range";
import { tempColor } from "@/lib/ipma/temp-color";

/** Abaixo deste valor a precipitação não vale a pena mostrar. */
const PRECIP_THRESHOLD = 10;

function dayLabel(iso: string): { wd: string; dm: string } {
  const d = new Date(iso);
  return { wd: weekday(iso), dm: `${d.getDate()}` };
}

export function DailyList({ days }: { days: Daily[] }) {
  const bars = temperatureBars(days);

  return (
    <section aria-label="Previsão diária" className="px-4">
      <h2 className="mb-3 text-2xl font-bold tracking-tight">Esta semana</h2>
      <ul className="flex flex-col gap-2">
        {days.map((d, i) => {
          const bar = bars[i];
          const showPrecip =
            d.precipitationProb !== null &&
            d.precipitationProb >= PRECIP_THRESHOLD;
          const { wd, dm } = dayLabel(d.date);
          const gradient =
            d.tMin !== null && d.tMax !== null
              ? `linear-gradient(90deg, ${tempColor(d.tMin)}, ${tempColor(
                  d.tMax,
                )})`
              : undefined;

          return (
            <li
              key={d.date}
              data-testid="daily-row"
              className="flex items-center gap-2"
            >
              {/* Cápsula de precipitação azul, preenchimento espelhado (direita → esquerda) */}
              <span className="relative flex h-9 w-16 shrink-0 items-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                {showPrecip && (
                  <span
                    data-testid="precip-fill"
                    aria-hidden
                    className="absolute inset-y-0 bg-sky-500"
                    style={{
                      right: 0,
                      width: `${Math.round(d.precipitationProb!)}%`,
                    }}
                  />
                )}
                <span className="relative z-10 flex w-full items-center justify-between px-2">
                  <WeatherIcon id={d.weatherTypeId} size={26} />
                  {showPrecip && (
                    <span className="text-xs font-semibold text-white tabular-nums">
                      {precip(d.precipitationProb)}
                    </span>
                  )}
                </span>
              </span>

              {/* Dia + data */}
              <span className="flex w-12 shrink-0 flex-col leading-tight">
                <span className="text-sm font-semibold uppercase">{wd}</span>
                <span className="text-xs text-slate-400 tabular-nums">
                  {dm}
                </span>
              </span>

              {/* Cápsula de temperatura grossa: gradiente frio→quente, números dentro */}
              <span className="relative h-9 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                <span
                  data-testid="temp-bar"
                  className="absolute flex h-full items-center justify-between rounded-full px-3 text-sm font-bold text-white"
                  style={{
                    left: `${bar.leftPct}%`,
                    width: `${bar.widthPct}%`,
                    minWidth: "4rem",
                    background: gradient,
                  }}
                >
                  <span className="tabular-nums drop-shadow-sm">
                    {temp(d.tMin)}
                  </span>
                  <span className="tabular-nums drop-shadow-sm">
                    {temp(d.tMax)}
                  </span>
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
