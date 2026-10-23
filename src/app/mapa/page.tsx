import { getStations } from "@/lib/ipma/stations";
import { getObservations } from "@/lib/ipma/observations";
import { MapView } from "@/components/MapView";
import { Attribution } from "@/components/Attribution";

export const revalidate = 1800;

export default async function MapPage() {
  const [stations, obs] = await Promise.all([
    getStations(),
    getObservations(),
  ]);

  // Junta cada estação à sua observação mais recente (temp, vento, etc.).
  const points = stations.map((s) => ({ ...s, obs: obs.get(s.id) ?? null }));
  const withTemp = points.filter((p) => p.obs?.temp != null).length;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-3 py-6">
      <div className="px-4">
        <h1 className="text-2xl font-semibold tracking-tight">Mapa</h1>
        <p className="text-sm text-slate-500">
          Temperatura atual em {withTemp} estações do IPMA.
        </p>
      </div>
      <MapView stations={points} />
      <Attribution extra="Mapa © OpenStreetMap" />
    </main>
  );
}
