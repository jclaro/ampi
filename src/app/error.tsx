"use client";

import { CloudOff } from "lucide-react";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
      <CloudOff size={48} aria-hidden className="text-slate-400" />
      <h1 className="text-xl font-semibold">Algo correu mal</h1>
      <p className="text-sm text-slate-500">
        Não foi possível obter os dados do IPMA. Tenta novamente.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white"
      >
        Tentar de novo
      </button>
    </main>
  );
}
