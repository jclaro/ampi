"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listSaved,
  removeSaved,
  setDefault,
  type SavedLocation,
} from "@/lib/saved-locations";
import { Star, X } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { temp } from "@/lib/format";

interface Current {
  temp: number | null;
  weatherTypeId: number;
}

export function SavedLocationsList() {
  const [items, setItems] = useState<SavedLocation[]>([]);
  const [temps, setTemps] = useState<Record<string, Current>>({});

  useEffect(() => {
    setItems(listSaved());
  }, []);

  useEffect(() => {
    let active = true;
    items.forEach(async (loc) => {
      if (temps[loc.slug]) return;
      try {
        const res = await fetch(`/api/current/${loc.slug}`);
        if (!res.ok) return;
        const data = (await res.json()) as Current;
        if (active) setTemps((t) => ({ ...t, [loc.slug]: data }));
      } catch {
        // ignora falha pontual
      }
    });
    return () => {
      active = false;
    };
  }, [items, temps]);

  function remove(slug: string) {
    removeSaved(slug);
    setItems(listSaved());
  }

  function makeDefault(slug: string) {
    setDefault(slug);
    setItems(listSaved());
  }

  if (items.length === 0) {
    return (
      <p className="px-4 text-slate-500">
        Ainda não guardaste cidades. Abre uma localidade e toca em
        “Guardar”.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2 px-4">
      {items.map((loc, i) => {
        const current = temps[loc.slug];
        return (
          <li
            key={loc.slug}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-800"
          >
            <Link
              href={`/${loc.slug}`}
              className="flex flex-1 items-center gap-3"
            >
              {current && (
                <WeatherIcon id={current.weatherTypeId} size={32} />
              )}
              <span className="font-medium">{loc.name}</span>
              {i === 0 && (
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  Predefinida
                </span>
              )}
              <span className="ml-auto text-lg font-semibold tabular-nums">
                {current ? temp(current.temp) : "…"}
              </span>
            </Link>
            {i !== 0 && (
              <button
                type="button"
                onClick={() => makeDefault(loc.slug)}
                aria-label={`definir ${loc.name} como predefinida`}
                className="text-sky-600"
              >
                <Star size={16} aria-hidden />
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(loc.slug)}
              aria-label={`remover ${loc.name}`}
              className="text-slate-400 hover:text-red-500"
            >
              <X size={16} aria-hidden />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
