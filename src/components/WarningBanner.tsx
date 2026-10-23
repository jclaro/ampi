import Link from "next/link";
import { TriangleAlert, ChevronRight } from "lucide-react";
import type { Warning } from "@/lib/ipma/types";

// ---------------------------------------------------------------------------
// Severidade
// ---------------------------------------------------------------------------

const SEVERITY: Record<Warning["level"], number> = {
  green: 0,
  yellow: 1,
  orange: 2,
  red: 3,
};

function dominant(warnings: Warning[]): Warning["level"] {
  return warnings.reduce<Warning["level"]>(
    (max, w) => (SEVERITY[w.level] > SEVERITY[max] ? w.level : max),
    "yellow",
  );
}

// ---------------------------------------------------------------------------
// Tokens de estilo por nível de aviso.
// Cumpre WCAG AA (4.5:1) em tema claro e escuro.
//
// Claro: superfície tingida + texto escuro
// Escuro: superfície mais profunda + texto claro (variantes dark:)
// A borda lateral dá identidade de cor imediata, mesmo sem ler o texto.
// ---------------------------------------------------------------------------

const LEVEL_TOKENS: Record<
  Warning["level"],
  {
    wrapper: string;
    badge: string;
    icon: string;
  }
> = {
  green: {
    // Não é renderizado (verde = sem aviso), mantido por completude
    wrapper: "",
    badge: "",
    icon: "",
  },
  yellow: {
    wrapper:
      "border-yellow-400 bg-yellow-50 text-yellow-900 dark:border-yellow-400 dark:bg-yellow-950/60 dark:text-yellow-100",
    badge:
      "bg-yellow-200 text-yellow-900 dark:bg-yellow-800/70 dark:text-yellow-200",
    icon: "text-yellow-600 dark:text-yellow-400",
  },
  orange: {
    wrapper:
      "border-orange-500 bg-orange-50 text-orange-950 dark:border-orange-400 dark:bg-orange-950/60 dark:text-orange-100",
    badge:
      "bg-orange-200 text-orange-900 dark:bg-orange-800/70 dark:text-orange-200",
    icon: "text-orange-600 dark:text-orange-400",
  },
  red: {
    wrapper:
      "border-red-600 bg-red-600 text-white dark:border-red-500 dark:bg-red-900/80 dark:text-red-100",
    badge: "bg-red-700 text-white dark:bg-red-700 dark:text-red-100",
    icon: "text-white dark:text-red-300",
  },
};

// ---------------------------------------------------------------------------
// Formatação temporal.
// Mostra o limite mais próximo: início (se ainda não começou) ou fim (se ativo).
// ---------------------------------------------------------------------------

function formatBoundary(startIso: string, endIso: string): string {
  const now = Date.now();
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();

  const target = now < start ? start : end;
  const prefix = now < start ? "a partir de" : "até";

  const d = new Date(target);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const hhmm = d.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(d, today)) return `${prefix} às ${hhmm}`;
  if (isSameDay(d, tomorrow)) return `${prefix} amanhã ${hhmm}`;

  const weekday = d.toLocaleDateString("pt-PT", { weekday: "short" });
  // "seg." → "seg"
  return `${prefix} ${weekday.replace(".", "")} ${hhmm}`;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function WarningBanner({ warnings }: { warnings: Warning[] }) {
  if (warnings.length === 0) return null;

  const level = dominant(warnings);
  const tokens = LEVEL_TOKENS[level];

  // Tipos únicos, ordenados por severidade (mais grave primeiro)
  const sorted = [...warnings].sort(
    (a, b) => SEVERITY[b.level] - SEVERITY[a.level],
  );
  const uniqueTypes = Array.from(new Set(sorted.map((w) => w.type)));

  // Aviso principal: o mais severo
  const primary = sorted[0];
  const rest = uniqueTypes.length - 1;

  // Janela temporal do aviso principal
  const timeHint = formatBoundary(primary.startTime, primary.endTime);

  // Rótulo acessível para o conjunto de avisos
  const ariaLabel =
    warnings.length === 1
      ? `Aviso meteorológico ${level}: ${primary.type}. ${timeHint}. Ver detalhes.`
      : `${warnings.length} avisos meteorológicos ativos, nível mais severo: ${level}. Ver detalhes.`;

  return (
    <Link
      href="/avisos"
      role="alert"
      aria-label={ariaLabel}
      className={[
        // Disposição
        "mx-4 flex items-center gap-3 rounded-xl border-l-4 px-4 py-3",
        // Contorno subtil para definir a forma em tema claro
        "ring-1 ring-inset ring-black/5 dark:ring-white/5",
        // Feedback de hover / foco
        "transition-opacity duration-150 hover:opacity-90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current",
        // Pulsação (só no vermelho/crítico) respeitando prefers-reduced-motion
        level === "red"
          ? "motion-safe:animate-[pulse_2.5s_ease-in-out_infinite]"
          : "",
        tokens.wrapper,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Ícone */}
      <TriangleAlert
        size={18}
        aria-hidden
        className={`shrink-0 ${tokens.icon}`}
      />

      {/* Conteúdo principal */}
      <span className="min-w-0 flex-1">
        {/* 1ª linha: rótulo + tipo principal + contagem de restantes */}
        <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
            {warnings.length === 1 ? "Aviso" : "Avisos"}
          </span>
          <span className="text-sm font-semibold leading-snug">
            {primary.type}
          </span>
          {rest > 0 && (
            <span
              className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium leading-none ${tokens.badge}`}
            >
              +{rest}
            </span>
          )}
        </span>

        {/* 2ª linha: janela temporal */}
        <span className="mt-0.5 block text-xs opacity-65">{timeHint}</span>
      </span>

      {/* Chevron (indica que é clicável) */}
      <ChevronRight
        size={16}
        aria-hidden
        className="shrink-0 opacity-50"
      />
    </Link>
  );
}
