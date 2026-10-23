import { getSeismic } from "@/lib/ipma/seismic";

export const revalidate = 300;

function fmtTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function magColor(mag: number | null): string {
  if (mag === null) return "bg-slate-300 text-slate-700";
  if (mag >= 4) return "bg-red-600 text-white";
  if (mag >= 3) return "bg-orange-500 text-white";
  if (mag >= 2) return "bg-yellow-400 text-yellow-900";
  return "bg-slate-200 text-slate-700";
}

export default async function SeismicPage() {
  const events = (await getSeismic()).slice(0, 20);

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Sismos recentes</h1>
      <p className="text-sm text-slate-500">
        Atividade sísmica no Continente e Madeira (últimos 30 dias).
      </p>
      <ul className="flex flex-col gap-2">
        {events.map((e, i) => (
          <li
            key={`${e.time}-${i}`}
            data-testid="seismic-row"
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums ${magColor(e.magnitude)}`}
            >
              {e.magnitude === null ? "–" : e.magnitude.toFixed(1)}
            </span>
            <div className="flex flex-col">
              <span className="font-medium">{e.region}</span>
              <span className="text-xs text-slate-500">
                {fmtTime(e.time)} · prof. {e.depth ?? "–"} km
                {e.felt && " · sentido"}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <footer className="pt-4 text-center text-xs text-slate-400">
        Dados:{" "}
        <a href="https://www.ipma.pt" className="underline" rel="noreferrer">
          IPMA
        </a>
      </footer>
    </main>
  );
}
