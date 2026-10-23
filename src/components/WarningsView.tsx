"use client";

import { useEffect, useState } from "react";
import type { Warning } from "@/lib/ipma/types";
import { defaultSlug } from "@/lib/saved-locations";
import { readLastLocation } from "@/lib/last-location";
import { WarningCard } from "./WarningCard";

export function WarningsView({
  warnings,
  areaBySlug,
}: {
  warnings: Warning[];
  areaBySlug: Record<string, string>;
}) {
  const [areaId, setAreaId] = useState<string | null>(null);

  useEffect(() => {
    const slug = defaultSlug() ?? readLastLocation();
    if (slug && areaBySlug[slug]) setAreaId(areaBySlug[slug]);
  }, [areaBySlug]);

  const local = areaId
    ? warnings.filter((w) => w.areaId === areaId)
    : [];

  if (warnings.length === 0) {
    return (
      <p className="text-slate-500">
        Sem avisos meteorológicos em vigor no momento.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {local.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-600">
            Na tua zona
          </h2>
          <ul className="flex flex-col gap-3">
            {local.map((w, i) => (
              <WarningCard key={`local-${w.type}-${i}`} warning={w} />
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-3">
        {local.length > 0 && (
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Todo o país
          </h2>
        )}
        <ul className="flex flex-col gap-3">
          {warnings.map((w, i) => (
            <WarningCard key={`${w.areaId}-${w.type}-${i}`} warning={w} />
          ))}
        </ul>
      </section>
    </div>
  );
}
