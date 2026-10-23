"use client";

import { useEffect } from "react";
import { saveLastLocation } from "@/lib/last-location";

/** Guarda o slug atual como "último local" ao visitar a página. */
export function RememberLocation({ slug }: { slug: string }) {
  useEffect(() => {
    saveLastLocation(slug);
  }, [slug]);
  return null;
}
