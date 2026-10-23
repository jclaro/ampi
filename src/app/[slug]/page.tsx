import { notFound } from "next/navigation";
import {
  getForecastBySlug,
  getLocationOptions,
} from "@/lib/ipma/forecast";
import { getWarnings, activeWarningsForArea } from "@/lib/ipma/warnings";
import { getFireRisk, dicoFor, fireRiskLabel } from "@/lib/ipma/fire";
import { accentFor } from "@/lib/ipma/accent";
import { upcomingHours } from "@/lib/ipma/select";
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

export const revalidate = 1800;
export const dynamicParams = true; // slugs não pré-gerados renderizam on-demand e cacheiam

/**
 * Pré-gera cada localidade como página ISR estática → servida da CDN partilhada,
 * garantindo que cada visita NÃO dispara novo pedido ao IPMA.
 */
export async function generateStaticParams() {
  const options = await getLocationOptions();
  return options.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getForecastBySlug(slug);
  if (!data) return { title: "Localidade não encontrada — AMPI" };
  const { location, daily } = data;
  const today = daily[0];
  const range = today ? ` ${Math.round(today.tMin ?? 0)}°–${Math.round(today.tMax ?? 0)}°` : "";
  return {
    title: `${location.name} — Meteorologia | AMPI`,
    description: `Previsão do tempo para ${location.name}:${range}. Dados do IPMA numa interface mobile-first.`,
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [data, allWarnings, options, fireMap] = await Promise.all([
    getForecastBySlug(slug),
    getWarnings(),
    getLocationOptions(),
    getFireRisk(0),
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

  const fiveDays = daily.slice(0, 5);
  const accent = accentFor(fiveDays);

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 pb-12">
      <RememberLocation slug={location.slug} />
      <div className="pt-4">
        <LocationSearch options={options} />
      </div>
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
        <NowDetails hour={now} fireRisk={fireRisk} uv={today?.uv ?? null} />
      )}
      <DailyList days={fiveDays} />
      <footer className="px-4 pt-4 text-center text-xs text-slate-400">
        Dados:{" "}
        <a
          href="https://www.ipma.pt"
          className="underline"
          rel="noreferrer"
          target="_blank"
        >
          IPMA
        </a>{" "}
        · AMPI é uma visualização alternativa não-oficial.
      </footer>
    </main>
  );
}
