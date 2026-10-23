/**
 * Atribuição à fonte dos dados (IPMA), com o logo-símbolo oficial e hiperligação,
 * conforme as condições de utilização da API do IPMA. Subtil, no rodapé.
 */
export function Attribution({ extra }: { extra?: string }) {
  return (
    <footer className="flex flex-col items-center gap-2 px-4 pt-4 text-center text-xs text-slate-400">
      <a
        href="https://www.ipma.pt"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Dados do IPMA — abrir ipma.pt"
      >
        <span>Dados:</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ipma-logo.svg"
          alt="IPMA"
          height={16}
          className="h-4 w-auto dark:brightness-0 dark:invert"
        />
      </a>
      <span>
        Visualização alternativa não-oficial{extra ? ` · ${extra}` : ""}
      </span>
    </footer>
  );
}
