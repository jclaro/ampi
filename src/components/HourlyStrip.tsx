import { ArrowUp, Droplet } from "lucide-react";
import type { Hourly } from "@/lib/ipma/types";
import type { Accent } from "@/lib/ipma/accent";
import { WeatherIcon } from "./WeatherIcon";
import { temp, hour } from "@/lib/format";
import { hourlyHeights } from "@/lib/ipma/hourly-bars";
import { windBearing } from "@/lib/ipma/wind";
import { isRainy } from "@/lib/ipma/weather-types";
import { conditionCircleClass } from "@/lib/ipma/condition-color";

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
      {/* Mobile: carrossel horizontal. Desktop (≥ lg): todas as horas numa
          única linha (até 24 colunas), sem scroll — cartões estreitos, com
          a base de vento simplificada (só o valor, sem "km/h"). */}
      <div className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:grid-cols-[repeat(24,minmax(0,1fr))] lg:gap-0.5 lg:overflow-x-visible lg:pb-0">
        {bars.map(({ hour: h, heightPct }) => {
          const rainy = isRainy(h.weatherTypeId);
          return (
            <div
              key={h.date}
              data-testid="hourly-cell"
              className="flex min-w-0 shrink-0 flex-col items-center gap-2 lg:w-auto lg:shrink lg:gap-1"
            >
              {/* Cartão sólido de altura proporcional à temperatura.
                  lg:w-full → o wrapper ocupa a célula toda para o cartão
                  interior (lg:w-full) poder encher a largura disponível. */}
              <div className="flex items-end lg:w-full" style={{ height: 112 }}>
                <div
                  className={`flex w-14 flex-col items-center justify-between rounded-xl px-1 py-2 lg:w-full lg:rounded-lg lg:px-0.5 ${accent.solid} ${accent.onSolid}`}
                  style={{ height: `${heightPct}%` }}
                >
                  <span className="text-lg font-bold tabular-nums leading-none lg:text-[13px]">
                    {temp(h.temp)}
                  </span>
                  {/* Base: chuva → % de probabilidade; seco → vento (km/h, distinto da temperatura) */}
                  {rainy && h.precipitationProb !== null ? (
                    <span
                      data-testid="hour-base-rain"
                      className="flex items-center gap-0.5 text-[10px] font-medium leading-none lg:text-[9px]"
                    >
                      <Droplet size={10} aria-hidden className="lg:hidden" />
                      {Math.round(h.precipitationProb)}%
                    </span>
                  ) : (
                    h.windSpeed !== null && (
                      <span
                        data-testid="hour-base-wind"
                        className="flex items-center gap-0.5 text-[9px] font-medium leading-none opacity-75"
                      >
                        <ArrowUp
                          size={10}
                          aria-hidden
                          style={{
                            transform: `rotate(${windBearing(h.windDir)}deg)`,
                          }}
                        />
                        <span className="tabular-nums">
                          {Math.round(h.windSpeed)}
                          <span className="lg:hidden"> km/h</span>
                        </span>
                      </span>
                    )
                  )}
                </div>
              </div>
              {/* Hora + ícone de condição (em círculo colorido), por baixo */}
              <span
                data-testid="hour-label"
                className="text-sm font-medium text-slate-500 tabular-nums lg:text-[11px]"
              >
                {hour(h.date)}
              </span>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full lg:h-7 lg:w-7 ${conditionCircleClass(
                  h.weatherTypeId,
                  { date: h.date },
                )}`}
              >
                <WeatherIcon
                  id={h.weatherTypeId}
                  date={h.date}
                  size={32}
                  className="h-8 w-8 lg:h-6 lg:w-6"
                />
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
