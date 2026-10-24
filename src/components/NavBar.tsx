"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CloudSun,
  MapPin,
  Map as MapIcon,
  TriangleAlert,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const SECTIONS = ["/mapa", "/avisos", "/sismos", "/locais"];
const isSection = (p: string, prefix: string) => p.startsWith(prefix);

// Classes partilhadas entre os separadores da nav e o ThemeToggle, para que
// o botão de tema fique visualmente idêntico aos itens inativos.
export const navItemBase =
  "flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 " +
  "text-[11px] font-medium leading-none transition-colors duration-150 " +
  "outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:ring-offset-0 " +
  "active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100";

export const navItemActive =
  "bg-sky-600 text-white shadow-sm shadow-sky-600/30 hover:bg-sky-600";

export const navItemInactive =
  "text-slate-600 hover:bg-slate-100 hover:text-slate-900 " +
  "dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white";

const ITEMS: {
  href: string;
  label: string;
  Icon: LucideIcon;
  match: (p: string) => boolean;
}[] = [
  {
    href: "/",
    label: "Hoje",
    Icon: CloudSun,
    match: (p: string) => !SECTIONS.some((s) => isSection(p, s)),
  },
  { href: "/locais", label: "Locais", Icon: MapPin, match: (p) => isSection(p, "/locais") },
  { href: "/mapa", label: "Mapa", Icon: MapIcon, match: (p) => isSection(p, "/mapa") },
  { href: "/avisos", label: "Avisos", Icon: TriangleAlert, match: (p) => isSection(p, "/avisos") },
  { href: "/sismos", label: "Sismos", Icon: Activity, match: (p) => isSection(p, "/sismos") },
];

/**
 * Lista de ligações de navegação, partilhada pela tab-bar mobile (NavBar) e
 * pelo rodapé desktop (SiteFooter). O estado ativo segue a rota atual.
 */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {ITEMS.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`${navItemBase} ${active ? navItemActive : navItemInactive}`}
          >
            <item.Icon size={18} aria-hidden strokeWidth={2} />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

/**
 * Barra de navegação mobile: tab-bar flutuante colada ao fundo do ecrã.
 * Em desktop desaparece (`sm:hidden`) — aí a navegação vive no SiteFooter e a
 * pesquisa/toggle vivem no TopBar.
 */
export function NavBar() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-20 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] sm:hidden"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-around gap-1 rounded-2xl border border-slate-200/70 bg-white/80 p-1 shadow-lg shadow-slate-900/5 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80 dark:shadow-black/20">
        <NavLinks />
        <ThemeToggle />
      </div>
    </nav>
  );
}
