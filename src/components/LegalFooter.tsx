import Link from "next/link";

/**
 * Rodapé das páginas legais com a identificação do responsável pelo serviço,
 * exigida pelo DL 7/2004 (comércio eletrónico), e ligações entre documentos.
 */
export function LegalFooter() {
  return (
    <footer className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800">
      <p className="mb-2 font-medium text-slate-600 dark:text-slate-400">
        Responsável pelo serviço
      </p>
      <p>
        AMPI — serviço informativo gratuito e não-oficial.
        <br />
        Contacto:{" "}
        <a
          href="mailto:geral@ampi.pt"
          className="text-sky-600 underline dark:text-sky-400"
        >
          geral@ampi.pt
        </a>
      </p>
      <nav className="mt-4 flex gap-4" aria-label="Páginas legais">
        <Link href="/" className="hover:text-slate-800 dark:hover:text-slate-200">
          Início
        </Link>
        <Link
          href="/privacidade"
          className="hover:text-slate-800 dark:hover:text-slate-200"
        >
          Privacidade
        </Link>
        <Link
          href="/termos"
          className="hover:text-slate-800 dark:hover:text-slate-200"
        >
          Termos
        </Link>
      </nav>
    </footer>
  );
}
