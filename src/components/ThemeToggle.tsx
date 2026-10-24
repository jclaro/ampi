"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/** Devolve se o tema escuro está ativo neste momento (classe na <html>). */
function isDarkNow() {
  return document.documentElement.classList.contains("dark");
}

/**
 * Alterna o tema entre claro e escuro. O default inicial segue o sistema
 * (aplicado pelo script anti-FOWT do layout); ao clicar, a escolha passa a
 * explícita e persiste em localStorage.
 */
export function ThemeToggle() {
  // SSR não conhece o tema → assume claro e sincroniza no cliente.
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(isDarkNow());
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  // Antes de montar, mostra um placeholder neutro (evita flash de ícone errado).
  const label = dark ? "Mudar para tema claro" : "Mudar para tema escuro";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={mounted ? dark : undefined}
      title={label}
      className="flex flex-col items-center gap-0.5 px-4 py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
    >
      {/* Mostra o ícone do estado atual; a cor/ação indica a mudança. */}
      {dark ? (
        <Moon size={20} aria-hidden strokeWidth={2} />
      ) : (
        <Sun size={20} aria-hidden strokeWidth={2} />
      )}
      Tema
    </button>
  );
}
