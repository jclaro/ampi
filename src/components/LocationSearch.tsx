"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocateFixed, Search } from "lucide-react";
import { searchLocations } from "@/lib/ipma/search";
import { nearest } from "@/lib/ipma/geo";
import { saveLastLocation } from "@/lib/last-location";

export interface SearchOption {
  name: string;
  slug: string;
  lat: number;
  lon: number;
}

export function LocationSearch({
  options,
  className = "mx-4",
}: {
  options: SearchOption[];
  /** Posicionamento do contentor (default: margem lateral da página). */
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const results = searchLocations(options, query);
  const open = focused || results.length > 0;

  function go(slug: string) {
    setQuery("");
    setFocused(false);
    router.push(`/${slug}`);
  }

  function locate() {
    if (!navigator.geolocation) {
      setError("Geolocalização indisponível.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = nearest(options, pos.coords.latitude, pos.coords.longitude);
        saveLastLocation(loc.slug);
        setLocating(false);
        go(loc.slug);
      },
      () => {
        setError("Não foi possível obter a sua localização.");
        setLocating(false);
      },
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
      />
      <input
        type="search"
        role="searchbox"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="Procurar localidade"
        aria-label="Procurar localidade"
        className="w-full rounded-full border border-slate-300 bg-slate-100 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-500 shadow-sm outline-none transition-colors hover:border-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:border-slate-500 dark:focus:bg-slate-900"
      />
      {open && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {/* Opção permanente, sempre a primeira */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={locate}
            disabled={locating}
            className="flex w-full items-center gap-2 border-b border-slate-100 px-4 py-2.5 text-left text-sm font-medium text-sky-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:hover:bg-slate-800"
          >
            <LocateFixed size={16} aria-hidden />
            {locating ? "A localizar…" : "Usar a minha localização"}
          </button>
          {error && (
            <p className="px-4 py-2 text-xs text-red-600">{error}</p>
          )}
          {results.length > 0 && (
            <ul className="max-h-72 overflow-y-auto">
              {results.map((r) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => go(r.slug)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 focus:bg-slate-100 focus:outline-none dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                  >
                    {r.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
