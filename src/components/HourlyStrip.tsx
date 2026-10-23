import { ArrowUp, Droplet } from "lucide-react";
import type { Hourly } from "@/lib/ipma/types";
import type { Accent } from "@/lib/ipma/accent";
import { WeatherIcon } from "./WeatherIcon";
import { temp, hour } from "@/lib/format";
import { hourlyHeights } from "@/lib/ipma/hourly-bars";
import { windBearing } from "@/lib/ipma/wind";
import { isRainy } from "@/lib/ipma/weather-types";

export function HourlyStrip({
  hours,
  accent,
  title = "Esta tarde",
}: {
  hours: Hourly[];
  accent: Accent;
  title?: string;
}) {
  const bars = hourlyHeights(hours, 60, 100);

  return (
    <section aria-label="Previsão horária" className="px-4">
      <h2 className="mb-1 text-2xl font-bold tracking-tight">{title}</h2>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {bars.map(({ hour: h, heightPct }) => {
          const rainy = isRainy(h.weatherTypeId);
          return (
            <div
              key={h.date}
              data-testid="hourly-cell"
              className="flex shrink-0 flex-col items-center gap-2"
            >
              {/* Cartão sólido de altura proporcional à temperatura */}
              <div className="flex items-end" style={{ height: 112 }}>
                <div
                  className={`flex w-14 flex-col items-center justify-between rounded-xl px-1 py-2 ${accent.solid} ${accent.onSolid}`}
                  style={{ height: `${heightPct}%` }}
                >
                  <span className="text-lg font-bold tabular-nums leading-none">
                    {temp(h.temp)}
                  </span>
                  {/* Base: chuva → % de probabilidade; seco → vento */}
                  {rainy && h.precipitationProb !== null ? (
                    <span
                      data-testid="hour-base-rain"
                      className="flex items-center gap-0.5 text-[10px] font-medium leading-none"
                    >
                      <Droplet size={10} aria-hidden />
                      {Math.round(h.precipitationProb)}%
                    </span>
                  ) : (
                    h.windSpeed !== null && (
                      <span
                        data-testid="hour-base-wind"
                        className="flex flex-col items-center text-[10px] leading-tight opacity-90"
                      >
                        <ArrowUp
                          size={12}
                          aria-hidden
                          style={{
                            transform: `rotate(${windBearing(h.windDir)}deg)`,
                          }}
                        />
                        <span className="tabular-nums">
                          {Math.round(h.windSpeed)}
                        </span>
                      </span>
                    )
                  )}
                </div>
              </div>
              {/* Hora + ícone de condição, por baixo */}
              <span
                data-testid="hour-label"
                className="text-sm font-medium text-slate-500 tabular-nums"
              >
                {hour(h.date)}
              </span>
              <WeatherIcon id={h.weatherTypeId} date={h.date} size={38} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
