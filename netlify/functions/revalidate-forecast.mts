import type { Config } from "@netlify/functions";

/**
 * Scheduled Function da Netlify: invalida periodicamente a cache das previsões
 * chamando a rota /api/revalidate da própria app.
 *
 * O IPMA só republica a previsão ~2x/dia, mas a horas variáveis; correr a cada
 * 30 min garante que, pouco depois de sair previsão nova, os visitantes já a
 * veem — sem precisar de esperar pela expiração do TTL (6h).
 *
 * `URL` é injetada pela Netlify (URL canónica do site em produção).
 * `REVALIDATE_SECRET` tem de estar definido nas env vars do site.
 */
export default async function handler() {
  const base = process.env.URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret) {
    console.error("Faltam env vars URL ou REVALIDATE_SECRET");
    return;
  }

  const res = await fetch(`${base}/api/revalidate`, {
    headers: { "x-revalidate-secret": secret },
  });
  const body = await res.text();
  console.log(`revalidate → ${res.status} ${body}`);
}

export const config: Config = {
  schedule: "*/30 * * * *",
};
