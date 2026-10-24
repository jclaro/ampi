"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultSlug } from "@/lib/saved-locations";
import { readLastLocation } from "@/lib/last-location";

/**
 * Na raiz (/), redireciona para a localidade preferida do utilizador SE existir:
 * predefinida (lista de locais guardados) → última visitada → senão nada.
 * Quando não há preferência, fica em / (que o servidor renderizou como Lisboa),
 * sem mudar o URL. Lisboa é só o fallback, nunca motivo de redirect.
 */
export function PreferredLocationRedirect({ fallback }: { fallback: string }) {
  const router = useRouter();
  useEffect(() => {
    const preferred = defaultSlug() ?? readLastLocation();
    if (preferred && preferred !== fallback) {
      router.replace(`/${preferred}`);
    }
  }, [router, fallback]);
  return null;
}
