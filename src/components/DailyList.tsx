"use client";

import { useState } from "react";
import type { Daily } from "@/lib/ipma/types";
import { WeatherIcon } from "./WeatherIcon";
import { temp, weekday, precip } from "@/lib/format";
import { temperatureBars } from "@/lib/ipma/range";
import { tempColor } from "@/lib/ipma/temp-color";
import { conditionCircleClass } from "@/lib/ipma/condition-color";

/** Abaixo deste valor a precipitação não vale a pena mostrar. */
const PRECIP_THRESHOLD = 10;

/**
 * Largura (%) da barra de chuva no contentor. O círculo do ícone fica encostado
 * à direita e ocupa sempre a mesma coluna; a barra parte desse ponto fixo e a
 * probabilidade só começa a "contar" a partir daí, crescendo para a esquerda no
 * espaço restante (0% = só o círculo; 100% = barra cheia).
 */
const CIRCLE_REACH_PCT = 72; // a barra (contentor w-36) tem de alcançar o círculo (w-9) à direita
function precipBarPct(prob: number): number {
  const remaining = 100 - CIRCLE_REACH_PCT;
  return CIRCLE_REACH_PCT + (Math.min(100, Math.max(0, prob)) / 100) * remaining;
}

function dayLabel(iso: string): { wd: string; dm: string } {
  const d = new Date(iso);
  return { wd: weekday(iso), dm: `${d.getDate()}` };
}

/** Dias visíveis antes de carregar em "Ver mais". */
const COLLAPSED_COUNT = 5;

export function DailyList({ days }: { days: Daily[] }) {
  const [expanded, setExpanded] = useState(false);
  // Escala das barras calculada sobre TODOS os dias, para que o mínimo/máximo
  // não mude ao expandir e as barras fiquem alinhadas entre os dois grupos.
  const bars = temperatureBars(days);
  const visible = expanded ? days : days.slice(0, COLLAPSED_COUNT);
  const showMoreButton = !expanded && days.length > COLLAPSED_COUNT;

  return (
    <section aria-label="Previsão diária" className="px-4">
      <h2 className="mb-3 text-2xl font-bold tracking-tight">Esta semana</h2>
      <ul className="flex flex-col gap-2">
        {visible.map((d, i) => {
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
              {/* Precipitação (estilo Hello Weather): o CÍRCULO do ícone fica SEMPRE na
                  mesma coluna (encostado à direita), para alinhar entre linhas. Quando há
                  chuva, a barra turquesa cresce para a esquerda a partir do círculo, com a
                  % no início. Em dias secos, só o círculo. */}
              <span className="relative h-11 w-36 shrink-0">
                {showPrecip && (
                  <span
                    data-testid="precip-fill"
                    className="absolute inset-y-0 right-0 flex items-center rounded-lg bg-cyan-500"
                    style={{ width: `${precipBarPct(d.precipitationProb!)}%` }}
                  >
                    {/* % no início da barra, com espaço à direita reservado p/ o círculo */}
                    <span className="pl-3 pr-10 text-sm font-bold text-white tabular-nums">
                      {precip(d.precipitationProb)}
                    </span>
                  </span>
                )}
                {/* Círculo: menor que a altura da barra (margem à volta, estilo Hello
                    Weather) e com posição fixa à direita (coluna alinhada entre linhas). */}
                <span
                  data-testid="day-icon-circle"
                  className={`absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full ${conditionCircleClass(
                    d.weatherTypeId,
                  )}`}
                >
                  <WeatherIcon id={d.weatherTypeId} size={32} />
                </span>
              </span>

              {/* Dia + data (centrado entre a precipitação e a temperatura) */}
              <span className="flex w-12 shrink-0 flex-col items-center leading-tight">
                <span className="text-sm font-semibold uppercase">{wd}</span>
                <span className="text-xs text-slate-400 tabular-nums">
                  {dm}
                </span>
              </span>

              {/* Barra de temperatura: gradiente frio→quente, números dentro */}
              <span className="relative h-11 flex-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span
                  data-testid="temp-bar"
                  className="absolute flex h-full items-center justify-between gap-2 rounded-lg px-3 text-sm font-bold text-white"
                  style={{
                    left: `${bar.leftPct}%`,
                    width: `${bar.widthPct}%`,
                    minWidth: "5.5rem",
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
      {showMoreButton && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 w-full rounded-lg py-2 text-sm font-semibold text-sky-600 transition-colors hover:bg-slate-100 dark:text-sky-400 dark:hover:bg-slate-800"
        >
          Ver mais
        </button>
      )}
    </section>
  );
}
