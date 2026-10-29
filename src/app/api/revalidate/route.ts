import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { FORECAST_TAG } from "@/lib/ipma/forecast";

export const dynamic = "force-dynamic";

/**
 * Endpoint de revalidação on-demand, chamado por uma Netlify Scheduled Function
 * (ver netlify/functions/revalidate-forecast.mts).
 *
 * Marca a cache de TODAS as previsões como stale. Não vai ao IPMA: apenas
 * invalida. O próximo visitante de cada localidade dispara um único refetch
 * (via fetch cache partilhada do Next), passando a servir dados frescos.
 *
 * Combinado com o TTL alto (6h) da previsão, isto dá: poucas chamadas ao IPMA
 * em regime normal + garantia de que, pouco depois de o IPMA republicar, os
 * visitantes já veem a previsão nova — sem depender da expiração do TTL.
 *
 * Protegido por `REVALIDATE_SECRET` (header `x-revalidate-secret` ou ?secret=).
 */
export async function GET(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET não configurado" },
      { status: 500 },
    );
  }
  const url = new URL(req.url);
  const provided =
    req.headers.get("x-revalidate-secret") ?? url.searchParams.get("secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }

  revalidateTag(FORECAST_TAG);
  return NextResponse.json({ revalidated: true, tag: FORECAST_TAG });
}
