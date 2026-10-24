import { getForecastBySlug, getLocationOptions } from "@/lib/ipma/forecast";
import { WeatherPage } from "@/components/WeatherPage";

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
  return <WeatherPage slug={slug} />;
}
