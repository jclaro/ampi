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

const SECTIONS = ["/mapa", "/avisos", "/sismos", "/locais"];
const isSection = (p: string, prefix: string) => p.startsWith(prefix);

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

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:static sm:border-b sm:border-t-0"
    >
      <ul className="mx-auto flex max-w-xl justify-around sm:justify-center sm:gap-8">
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 text-xs ${
                  active
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <item.Icon size={20} aria-hidden strokeWidth={2} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
