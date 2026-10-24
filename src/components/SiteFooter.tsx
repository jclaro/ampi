import { NavLinks } from "./NavBar";

/**
 * Rodapé desktop: navegação principal no fim da página, para manter o topo
 * limpo. Só aparece em desktop (`hidden sm:block`) — em mobile a navegação
 * vive na tab-bar fixa (NavBar).
 */
export function SiteFooter() {
  return (
    <footer className="mt-12 hidden border-t border-slate-200 py-6 dark:border-slate-800 sm:block">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4"
      >
        <NavLinks />
      </nav>
    </footer>
  );
}
