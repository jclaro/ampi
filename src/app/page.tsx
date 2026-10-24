import { WeatherPage } from "@/components/WeatherPage";
import { PreferredLocationRedirect } from "@/components/PreferredLocationRedirect";

export const revalidate = 1800;

// Localidade mostrada por omissão em /, quando não há preferência guardada.
const FALLBACK_SLUG = "lisboa";

// A raiz (ampi.pt) é a landing do produto, não a página da localidade por
// omissão — por isso o SEO é de marca/produto, não "Lisboa". O título por
// localidade vive em /{slug} (ver app/[slug]/page.tsx).
export const metadata = {
  title: "AMPI — Previsão do Tempo em Portugal | Dados do IPMA",
  description:
    "Previsão do tempo para todas as localidades de Portugal: temperatura, vento, chuva e avisos meteorológicos. Dados oficiais do IPMA numa interface rápida e mobile-first.",
};

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
