"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/** Devolve se o tema escuro está ativo neste momento (classe na <html>). */
function isDarkNow() {
  return document.documentElement.classList.contains("dark");
}

/**
 * Interruptor claro/escuro. O default inicial segue o sistema (aplicado pelo
 * script anti-FOWT do layout); ao clicar, a escolha passa a explícita e
 * persiste em localStorage. É um switch a sério (role="switch"): a bolinha
 * desliza entre o sol (claro) e a lua (escuro).
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

  const label = dark ? "Mudar para tema claro" : "Mudar para tema escuro";

  return (
    <button
      type="button"
      role="switch"
      onClick={toggle}
      aria-label={label}
      aria-checked={mounted ? dark : undefined}
      title={label}
      className="relative inline-flex h-9 w-16 items-center rounded-full border border-slate-200 bg-slate-100 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sky-500/50 dark:border-slate-700 dark:bg-slate-800"
    >
      {/* Ícones de fundo: sol à esquerda, lua à direita. */}
      <Sun
        size={15}
        aria-hidden
        strokeWidth={2}
        className="absolute left-2 text-amber-500"
      />
      <Moon
        size={15}
        aria-hidden
        strokeWidth={2}
        className="absolute right-2 text-sky-400"
      />
      {/* Bolinha deslizante (no estado claro fica à esquerda, escuro à direita). */}
      <span
        className={`pointer-events-none z-10 inline-flex h-7 w-7 translate-x-1 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 motion-reduce:transition-none dark:bg-slate-950 ${
          mounted && dark ? "translate-x-8" : "translate-x-1"
        }`}
      >
        {mounted && dark ? (
          <Moon size={14} aria-hidden strokeWidth={2} className="text-sky-400" />
        ) : (
          <Sun size={14} aria-hidden strokeWidth={2} className="text-amber-500" />
        )}
      </span>
    </button>
  );
}
