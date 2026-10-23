"use client";

import dynamic from "next/dynamic";
import type { StationPoint } from "./StationsMap";

// MapLibre precisa do browser — carregado só no cliente, sem SSR.
const StationsMap = dynamic(
  () => import("./StationsMap").then((m) => m.StationsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[70vh] w-full items-center justify-center text-slate-400">
        A carregar mapa…
      </div>
    ),
  },
);

export function MapView({ stations }: { stations: StationPoint[] }) {
  return <StationsMap stations={stations} />;
}
