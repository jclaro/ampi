import type { Metadata } from "next";
import Link from "next/link";
import { LegalFooter } from "@/components/LegalFooter";

export const metadata: Metadata = {
  title: "Política de Privacidade — AMPI",
  description:
    "Como o AMPI trata (ou não trata) os teus dados: sem tracking, sem publicidade, sem partilha.",
};

// Data da última revisão deste texto. Atualizar quando o conteúdo mudar.
const UPDATED = "24 de outubro de 2026";

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <article className="flex flex-col gap-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Política de Privacidade
          </h1>
          <p className="text-xs text-slate-500">Última atualização: {UPDATED}</p>
        </header>

        <p>
          O AMPI é uma visualização alternativa e <strong>não-oficial</strong> dos
          dados meteorológicos do IPMA. É um serviço gratuito e informativo. Levamos
          a privacidade a sério — por isso esta página é curta: há pouco a dizer.
        </p>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Em resumo
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Não usamos cookies de rastreio nem publicidade.</li>
            <li>Não temos analytics de terceiros (Google Analytics, Meta, etc.).</li>
            <li>Não criamos conta nem pedimos dados pessoais.</li>
            <li>Não vendemos nem partilhamos dados com terceiros.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Que dados são tratados
          </h2>

          <h3 className="font-medium text-slate-900 dark:text-slate-100">
            Localização (opcional)
          </h3>
          <p>
            Se usares o botão de localização, o teu navegador pede-te permissão e,
            caso aceites, fornece as coordenadas aproximadas <em>ao teu dispositivo</em>.
            Usamos essas coordenadas apenas para encontrar o concelho mais próximo.
            A localização <strong>não é enviada para nós nem guardada</strong> — o
            cálculo acontece no teu dispositivo. Podes recusar ou revogar a
            permissão a qualquer momento nas definições do navegador.
          </p>

          <h3 className="font-medium text-slate-900 dark:text-slate-100">
            Armazenamento local (localStorage)
          </h3>
          <p>
            Para te dar uma boa experiência, guardamos no teu próprio navegador os
            teus <strong>locais guardados</strong> e o <strong>último local visto</strong>.
            Esta informação fica apenas no teu dispositivo, não é um cookie de
            rastreio, e nunca nos é transmitida. Podes apagá-la limpando os dados do
            site no navegador. Por ser estritamente funcional, não requer banner de
            consentimento.
          </p>

          <h3 className="font-medium text-slate-900 dark:text-slate-100">
            Registos do servidor
          </h3>
          <p>
            Como qualquer site, o nosso alojamento regista automaticamente pedidos
            (incluindo o endereço IP) por motivos técnicos e de segurança. Estes
            registos são geridos pelo fornecedor de alojamento, têm retenção
            limitada e não são usados para te identificar ou criar perfis.
          </p>

          <h3 className="font-medium text-slate-900 dark:text-slate-100">
            Dados do IPMA e mapas
          </h3>
          <p>
            Os dados meteorológicos vêm do IPMA e são obtidos pelos nossos
            servidores (não pelo teu navegador). O mapa usa mosaicos do
            OpenStreetMap, que podem ser carregados diretamente pelo teu navegador a
            partir dos servidores desse serviço.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Base legal e os teus direitos (RGPD)
          </h2>
          <p>
            O tratamento mínimo que fazemos (registos do servidor) assenta no
            interesse legítimo de operar o serviço de forma segura. A localização
            depende do teu consentimento, dado através do navegador.
          </p>
          <p>
            Ao abrigo do RGPD, tens direito de acesso, retificação, apagamento,
            limitação e oposição ao tratamento dos teus dados. Como não guardamos
            dados que te identifiquem, na prática a maioria destes direitos resolve-se
            limpando os dados do site no teu navegador. Para qualquer questão,
            contacta-nos.
          </p>
          <p>
            Tens também o direito de apresentar reclamação à autoridade de controlo
            competente — em Portugal, a{" "}
            <a
              href="https://www.cnpd.pt"
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 underline dark:text-sky-400"
            >
              Comissão Nacional de Proteção de Dados (CNPD)
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Alterações
          </h2>
          <p>
            Podemos atualizar esta política. A data da última revisão está no topo
            desta página.
          </p>
        </section>

        <p className="text-sm">
          Vê também os{" "}
          <Link href="/termos" className="text-sky-600 underline dark:text-sky-400">
            Termos e Condições
          </Link>
          .
        </p>
      </article>

      <LegalFooter />
    </main>
  );
}
