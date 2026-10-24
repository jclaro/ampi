"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LocationSearch, type SearchOption } from "./LocationSearch";

/**
 * Cabeçalho desktop minimal: pesquisa de localidade + toggle claro/escuro,
 * centrados. Só aparece em desktop (`hidden sm:flex`) — em mobile a pesquisa
 * vive no conteúdo da página e o toggle vive na tab-bar (NavBar).
 */
export function TopBar() {
  // Opções para a pesquisa global. Carregadas uma vez de uma API cacheável.
  const [options, setOptions] = useState<SearchOption[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/locations")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: SearchOption[]) => active && setOptions(data))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="hidden items-center justify-center gap-3 px-4 py-4 sm:flex">
      {options.length > 0 && (
        <div className="w-80">
          <LocationSearch options={options} className="" />
        </div>
      )}
      <ThemeToggle />
    </div>
  );
}
