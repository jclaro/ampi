"use client";

import { useEffect, useState } from "react";
import type { Hourly, Location, Daily, Warning } from "@/lib/ipma/types";
import type { Accent } from "@/lib/ipma/accent";
import type { WindRange } from "@/lib/ipma/wind-range";
import type { SunTimes, MoonPhase } from "@/lib/sun";
import { upcomingHours } from "@/lib/ipma/select";
import { windRange } from "@/lib/ipma/wind-range";
import { nowInPortugal } from "@/lib/time";
import { periodTitle } from "@/lib/period";
import { Hero } from "./Hero";
import { HourlyStrip } from "./HourlyStrip";
import { WarningBanner } from "./WarningBanner";
import { NowDetails } from "./NowDetails";

/**
 * Tudo o que depende de "agora" (seleção da hora atual, próximas 24h, título do
 * período, intervalo de vento do dia) é calculado NO CLIENTE, não no servidor.
 *
 * Porquê: a página é ISR (HTML em cache na CDN). Se "agora" fosse calculado no
 * servidor, ficava congelado no HTML gerado na última revalidação — podendo
 * mostrar horas já passadas (ou até de ontem) no primeiro acesso. Ao recalcular
 * no browser a cada visita, a hora corrente está sempre correta, sem pedidos
 * extra ao IPMA (os dados horários/diários vêm já em cache do servidor).
 *
 * `initialPtNow` é o "agora" do servidor, usado só na primeira pintura para
 * evitar mismatch de hidratação; o `useEffect` recalcula logo no cliente.
 */
export function WeatherNow({
  location,
  hourly,
  today,
  accent,
  warnings,
  pressure,
  sun,
  moon,
  fireRisk,
  initialPtNowMs,
  action,
}: {
  location: Location;
  hourly: Hourly[];
  today: Daily | undefined;
  accent: Accent;
  warnings: Warning[];
  pressure?: number | null;
  sun?: SunTimes | null;
  moon?: MoonPhase | null;
  fireRisk?: { level: number; label: string } | null;
  initialPtNowMs: number;
  action?: React.ReactNode;
}) {
  const [ptNow, setPtNow] = useState<Date>(() => new Date(initialPtNowMs));

  useEffect(() => {
    // Recalcula "agora" no cliente e mantém atualizado enquanto a aba está
    // aberta (ao virar a hora, a tira e o "agora" avançam sozinhos).
    const tick = () => setPtNow(nowInPortugal());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const upcoming = upcomingHours(hourly, ptNow, 24);
  const now = upcoming[0] ?? hourly[0];
  const hourlyTitle = periodTitle(ptNow.getHours());

  // Vento ao longo do dia-calendário em que estamos (não as próximas 24h).
  const todayKey = ptNow.toDateString();
  const todayHours = hourly.filter(
    (h) => new Date(h.date).toDateString() === todayKey,
  );
  const wind: WindRange | null = windRange(
    todayHours.length > 0 ? todayHours : upcoming,
  );

  return (
    <>
      <Hero
        location={location}
        now={now}
        tMin={today?.tMin ?? null}
        tMax={today?.tMax ?? null}
        action={action}
      />
      <WarningBanner warnings={warnings} />
      <HourlyStrip hours={upcoming} accent={accent} title={hourlyTitle} />
      {now && (
        <NowDetails
          hour={now}
          wind={wind}
          pressure={pressure}
          sun={sun}
          moon={moon}
          fireRisk={fireRisk}
          uv={today?.uv ?? null}
        />
      )}
    </>
  );
}
