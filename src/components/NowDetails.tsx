"use client";

import { useEffect, useState } from "react";
import type { Hourly } from "@/lib/ipma/types";
import { MetricCards } from "./MetricCards";

/**
 * Detalhe das condições atuais, com revelação adaptada ao ecrã:
 * - Mobile (< sm): recolhido atrás de "Mais detalhes" (<details> nativo, acessível).
 * - Desktop (≥ sm): aberto automaticamente e sem o summary.
 */
export function NowDetails({
  hour,
  fireRisk,
  uv,
}: {
  hour: Hourly;
  fireRisk?: { level: number; label: string } | null;
  uv?: number | null;
}) {
  // Desktop → aberto por defeito. Em SSR assume mobile (fechado); ajusta no cliente.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => setOpen(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="group [&[open]_.chevron]:rotate-180"
    >
      <summary className="flex cursor-pointer list-none items-center justify-center gap-1 px-4 text-sm font-medium text-sky-600 sm:hidden">
        Mais detalhes
        <span className="chevron transition-transform" aria-hidden>
          ▾
        </span>
      </summary>
      <div className="mt-3">
        <MetricCards hour={hour} fireRisk={fireRisk} uv={uv} />
      </div>
    </details>
  );
}
