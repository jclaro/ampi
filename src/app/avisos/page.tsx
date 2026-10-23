import { getWarnings, activeWarnings } from "@/lib/ipma/warnings";
import { getLocations } from "@/lib/ipma/forecast";
import { WarningsView } from "@/components/WarningsView";
import { Attribution } from "@/components/Attribution";

export const revalidate = 600;

export default async function WarningsPage() {
  const [all, locations] = await Promise.all([getWarnings(), getLocations()]);
  const active = activeWarnings(all);

  // Mapa slug → área de aviso, para a secção "Na tua zona" (client-side).
  const areaBySlug: Record<string, string> = {};
  for (const l of locations) areaBySlug[l.slug] = l.warningAreaId;

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Avisos</h1>
      <WarningsView warnings={active} areaBySlug={areaBySlug} />
      <Attribution />
    </main>
  );
}
