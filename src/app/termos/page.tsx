import type { Metadata } from "next";
import Link from "next/link";
import { LegalFooter } from "@/components/LegalFooter";

export const metadata: Metadata = {
  title: "Termos e Condições — AMPI",
  description:
    "Condições de utilização do AMPI, uma visualização alternativa e não-oficial dos dados do IPMA.",
};

// Data da última revisão deste texto. Atualizar quando o conteúdo mudar.
const UPDATED = "24 de outubro de 2026";

export default function TermosPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <article className="flex flex-col gap-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Termos e Condições
          </h1>
          <p className="text-xs text-slate-500">Última atualização: {UPDATED}</p>
        </header>

        <p>
          Ao utilizares o AMPI aceitas estes termos. Se não concordares, por favor
          não uses o serviço.
        </p>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            1. O que é o AMPI
          </h2>
          <p>
            O AMPI é uma visualização alternativa, <strong>não-oficial</strong> e
            gratuita dos dados meteorológicos do IPMA (Instituto Português do Mar e
            da Atmosfera). <strong>Não somos afiliados, patrocinados nem endossados
            pelo IPMA.</strong> Os dados pertencem ao IPMA; o AMPI é apenas uma forma
            alternativa de os apresentar.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            2. Fonte dos dados e atribuição
          </h2>
          <p>
            Os dados meteorológicos são obtidos da API pública do IPMA e usados nos
            termos de utilização dessa API, com a devida atribuição. As fontes
            oficiais e autoritativas são sempre as do IPMA em{" "}
            <a
              href="https://www.ipma.pt"
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 underline dark:text-sky-400"
            >
              ipma.pt
            </a>
            . O mapa usa dados do OpenStreetMap, sujeitos à licença dos respetivos
            contribuidores.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            3. Sem garantias — isenção de responsabilidade
          </h2>
          <p>
            O serviço é fornecido <strong>&ldquo;tal como está&rdquo;</strong>, sem
            garantias de exatidão, atualidade ou disponibilidade. A informação
            meteorológica pode conter erros, estar desatualizada ou indisponível.
          </p>
          <p>
            <strong>
              Não tomes decisões críticas de segurança com base apenas no AMPI.
            </strong>{" "}
            Para avisos meteorológicos, estado do mar, risco de incêndio, atividade
            sísmica e qualquer situação que envolva segurança de pessoas ou bens,
            consulta sempre as fontes e avisos oficiais do IPMA e das autoridades de
            proteção civil. Na medida máxima permitida por lei, não nos
            responsabilizamos por quaisquer danos decorrentes do uso (ou
            impossibilidade de uso) deste serviço.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            4. Utilização aceitável
          </h2>
          <p>
            Deves usar o serviço de forma legal e razoável, sem tentar sobrecarregar,
            comprometer ou extrair dados de forma automatizada que prejudique o
            funcionamento do site ou dos serviços de que depende.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            5. Privacidade
          </h2>
          <p>
            O tratamento de dados está descrito na{" "}
            <Link
              href="/privacidade"
              className="text-sky-600 underline dark:text-sky-400"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            6. Alterações e lei aplicável
          </h2>
          <p>
            Podemos alterar estes termos a qualquer momento; a data da última revisão
            está no topo. Estes termos regem-se pela lei portuguesa, sendo
            competentes os tribunais portugueses, sem prejuízo dos direitos que te
            assistem enquanto consumidor.
          </p>
        </section>
      </article>

      <LegalFooter />
    </main>
  );
}
