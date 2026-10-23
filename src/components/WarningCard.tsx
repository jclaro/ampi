import type { Warning } from "@/lib/ipma/types";

const LEVEL_LABEL: Record<Warning["level"], string> = {
  green: "Verde",
  yellow: "Amarelo",
  orange: "Laranja",
  red: "Vermelho",
};

const LEVEL_DOT: Record<Warning["level"], string> = {
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  orange: "bg-orange-500",
  red: "bg-red-600",
};

function timeRange(w: Warning): string {
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  return `${fmt(w.startTime)} → ${fmt(w.endTime)}`;
}

export function WarningCard({ warning: w }: { warning: Warning }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <span
        className={`mt-1 h-3 w-3 shrink-0 rounded-full ${LEVEL_DOT[w.level]}`}
        aria-hidden
      />
      <div className="flex flex-col">
        <span className="font-medium">{w.type}</span>
        <span className="text-xs text-slate-500">
          {w.areaId} · {LEVEL_LABEL[w.level]} · {timeRange(w)}
        </span>
        {w.text && (
          <span className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {w.text}
          </span>
        )}
      </div>
    </li>
  );
}
