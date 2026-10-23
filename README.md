# AMPI — Meteorologia de Portugal

Visualização alternativa, moderna e **mobile-first** dos dados meteorológicos do
**IPMA** (Instituto Português do Mar e da Atmosfera), construída sobre a sua API
pública. Inspirada em apps como o Hello Weather.

> **Não-oficial.** AMPI não é afiliado ao IPMA. Os dados são do IPMA; esta é apenas
> uma forma alternativa de os apresentar.

## Funcionalidades

- **Previsão** horária e a 5 dias por localidade (430 concelhos), com tira horária
  de perfil térmico e barras de temperatura/precipitação legíveis "ao relance".
- **Avisos meteorológicos** (amarelo/laranja/vermelho), com secção "Na tua zona".
- **Mapa** de observações em tempo real — temperatura por estação, com detalhe de
  vento, humidade, pressão e precipitação.
- **Estado do mar, índice UV, risco de incêndio e sismos**.
- **Pesquisa** de localidades, **geolocalização** e **locais guardados** (localStorage).
- Tema claro/escuro automático, ícones por condição (dia/noite).

## Stack

- [Next.js 15](https://nextjs.org/) (App Router) + React 19
- [Tailwind CSS](https://tailwindcss.com/)
- [MapLibre GL](https://maplibre.org/) (mapa, sem chave) + OpenStreetMap
- [Vitest](https://vitest.dev/) + Testing Library (unit) e [Playwright](https://playwright.dev/) (E2E)

## Arquitetura & caching

O cliente **nunca** chama o IPMA diretamente. Toda a app consome uma camada de dados
(`src/lib/ipma/`) que faz fetch + normalização + **cache partilhada** (fetch cache do
Next + ISR). Como o IPMA atualiza as previsões 2×/dia, uma resposta em cache serve
milhares de visitas — o IPMA é chamado ~1×/janela de revalidação por endpoint, não por
visita. Falhas do IPMA são servidas com o último valor conhecido (stale).

## Desenvolvimento

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # unit (Vitest)
npm run test:e2e     # E2E (Playwright)
npm run lint
npm run build
```

## Deploy

Preparado para **Netlify** (`netlify.toml`) e **Vercel** (`vercel.json`). O ISR e a
cache de CDN são configurados automaticamente pelos respetivos plugins de Next.js.

## Licença

Código sob [MIT](./LICENSE). Dados © IPMA. Ícones: Meteocons (MIT), Lucide (ISC).
