import { notFound } from "next/navigation";
import {
  getForecastBySlug,
  getLocationOptions,
} from "@/lib/ipma/forecast";
import { getWarnings, activeWarningsForArea } from "@/lib/ipma/warnings";
import { getFireRisk, dicoFor, fireRiskLabel } from "@/lib/ipma/fire";
import { accentFor } from "@/lib/ipma/accent";
import { upcomingHours } from "@/lib/ipma/select";
import { windRange } from "@/lib/ipma/wind-range";
import { nearestPressure } from "@/lib/ipma/pressure";
import { getStations } from "@/lib/ipma/stations";
import { getObservations } from "@/lib/ipma/observations";
import { sunTimes, moonPhase } from "@/lib/sun";
import { nowInPortugal } from "@/lib/time";
import { periodTitle } from "@/lib/period";
import { Hero } from "@/components/Hero";
import { HourlyStrip } from "@/components/HourlyStrip";
import { DailyList } from "@/components/DailyList";
import { WarningBanner } from "@/components/WarningBanner";
import { NowDetails } from "@/components/NowDetails";
import { LocationSearch } from "@/components/LocationSearch";
import { RememberLocation } from "@/components/RememberLocation";
import { SaveButton } from "@/components/SaveButton";
import { Attribution } from "@/components/Attribution";

/**
 * Página de meteorologia de uma localidade (Server Component). Partilhada entre
 * a rota /[slug] e a raiz / (que renderiza Lisboa no servidor). Faz todo o
 * fetch ao IPMA e compõe a UII. `notFound()` se o slug for inválido.
 */
export async function WeatherPage({ slug }: { slug: string }) {
  const [data, allWarnings, options, fireMap, stations, observations] =
    await Promise.all([
      getForecastBySlug(slug),
      getWarnings(),
      getLocationOptions(),
      getFireRisk(0),
      getStations(),
      getObservations(),
    ]);
  if (!data) notFound();

  const { location, daily, hourly } = data;
  const today = daily[0];
  const ptNow = nowInPortugal();
  const upcoming = upcomingHours(hourly, ptNow, 24);
  const hourlyTitle = periodTitle(ptNow.getHours());
  const now = upcoming[0] ?? hourly[0];
  const warnings = activeWarningsForArea(allWarnings, location.warningAreaId);

  const fireLevel = fireMap.get(
    dicoFor(location.districtId, location.concelhoId),
  );
  const fireRisk =
    fireLevel !== undefined
      ? { level: fireLevel, label: fireRiskLabel(fireLevel) }
      : null;

  // Intervalo de vento ao longo do DIA em que estamos (não as próximas 24h):
  // horas do mesmo dia-calendário que "agora" em Portugal.
  const todayKey = ptNow.toDateString();
  const todayHours = hourly.filter(
    (h) => new Date(h.date).toDateString() === todayKey,
  );
  const wind = windRange(todayHours.length > 0 ? todayHours : upcoming);

  // Pressão da estação mais próxima com leitura válida (null → não se mostra).
  const pressure = nearestPressure(
    stations,
    observations,
    location.lat,
    location.lon,
  );

  // Nascer/pôr-do-sol e fase da lua calculados localmente.
  const sun = sunTimes(new Date(), location.lat, location.lon);
  const moon = moonPhase(new Date());

  const fiveDays = daily.slice(0, 5);
  const accent = accentFor(fiveDays);

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 pb-12 sm:pt-6 lg:max-w-5xl">
      <RememberLocation slug={location.slug} />
      {/* Pesquisa no topo só em mobile; em desktop vive na NavBar. */}
      <div className="pt-4 sm:hidden">
        <LocationSearch options={options} />
      </div>

      {/* Coluna única (larga em desktop), mesma ordem em mobile e desktop:
          Hero → Horárias → Detalhes → Semana. Os detalhes (condições de HOJE)
          ficam à vista em desktop e recolhidos em mobile (ver NowDetails). */}
      <Hero
        location={location}
        now={now}
        tMin={today?.tMin ?? null}
        tMax={today?.tMax ?? null}
        action={<SaveButton slug={location.slug} name={location.name} />}
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
      <DailyList days={fiveDays} />
      <Attribution />
    </main>
  );
}
