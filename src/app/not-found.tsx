import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
      <Compass size={48} aria-hidden className="text-slate-400" />
      <h1 className="text-xl font-semibold">Localidade não encontrada</h1>
      <p className="text-sm text-slate-500">
        Não encontrámos essa página. Verifica o nome da localidade.
      </p>
      <Link
        href="/lisboa"
        className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white"
      >
        Ver Lisboa
      </Link>
    </main>
  );
}
