import { getForecastBySlug } from "@/lib/ipma/forecast";
import { WeatherPage } from "@/components/WeatherPage";
import { PreferredLocationRedirect } from "@/components/PreferredLocationRedirect";

export const revalidate = 1800;

// Localidade mostrada por omissão em /, quando não há preferência guardada.
const FALLBACK_SLUG = "lisboa";

export async function generateMetadata() {
  const data = await getForecastBySlug(FALLBACK_SLUG);
  if (!data) return { title: "AMPI — Meteorologia de Portugal" };
  const { location, daily } = data;
  const today = daily[0];
  const range = today ? ` ${Math.round(today.tMin ?? 0)}°–${Math.round(today.tMax ?? 0)}°` : "";
  return {
    title: `${location.name} — Meteorologia | AMPI`,
    description: `Previsão do tempo para ${location.name}:${range}. Dados do IPMA numa interface mobile-first.`,
  };
}

/**
 * Raiz do site. Renderiza Lisboa no servidor (SSR/ISR) — o URL fica em / sem
 * redirecionar. No cliente, se houver localidade preferida guardada, aí sim
 * redireciona para /{localidade} (ver PreferredLocationRedirect).
 */
export default function Home() {
  return (
    <>
      <PreferredLocationRedirect fallback={FALLBACK_SLUG} />
      <WeatherPage slug={FALLBACK_SLUG} />
    </>
  );
}
