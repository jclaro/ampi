"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { addSaved, removeSaved, isSaved } from "@/lib/saved-locations";

export function SaveButton({ slug, name }: { slug: string; name: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isSaved(slug));
  }, [slug]);

  function toggle() {
    if (isSaved(slug)) {
      removeSaved(slug);
      setSaved(false);
    } else {
      addSaved({ slug, name });
      setSaved(true);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
        saved
          ? "bg-sky-600 text-white"
          : "border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"
      }`}
    >
      <Star size={15} aria-hidden fill={saved ? "currentColor" : "none"} />
      {saved ? "Guardado" : "Guardar"}
    </button>
  );
}
