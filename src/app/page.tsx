"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultSlug } from "@/lib/saved-locations";
import { readLastLocation } from "@/lib/last-location";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // Preferir a cidade predefinida (lista de locais); depois o último visto; senão Lisboa.
    const target = defaultSlug() ?? readLastLocation() ?? "lisboa";
    router.replace(`/${target}`);
  }, [router]);

  return (
    <main className="flex min-h-dvh items-center justify-center text-slate-400">
      A carregar…
    </main>
  );
}
