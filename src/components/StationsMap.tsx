"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Station } from "@/lib/ipma/stations";
import type { Observation } from "@/lib/ipma/observations";
import { tempColor } from "@/lib/ipma/temp-color";

export interface StationPoint extends Station {
  obs: Observation | null;
}

const STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

function popupHtml(p: StationPoint): string {
  const o = p.obs;
  const row = (label: string, value: string) =>
    `<div style="display:flex;justify-content:space-between;gap:12px"><span style="color:#64748b">${label}</span><strong style="color:#0f172a">${value}</strong></div>`;
  const rows: string[] = [];
  if (o?.temp != null) rows.push(row("Temperatura", `${Math.round(o.temp)}°`));
  if (o?.windKmh != null)
    rows.push(
      row("Vento", `${Math.round(o.windKmh)} km/h${o.windDir ? " " + o.windDir : ""}`),
    );
  if (o?.humidity != null) rows.push(row("Humidade", `${Math.round(o.humidity)}%`));
  if (o?.pressure != null) rows.push(row("Pressão", `${Math.round(o.pressure)} hPa`));
  if (o?.precAccum != null && o.precAccum > 0)
    rows.push(row("Precipitação", `${o.precAccum} mm`));
  return `<div style="font-family:system-ui;font-size:13px;min-width:160px;color:#0f172a"><div style="font-weight:700;margin-bottom:6px">${p.name}</div>${
    rows.join("") || '<span style="color:#64748b">Sem observação</span>'
  }</div>`;
}

/** Marcador: etiqueta com a temperatura, cor por valor; ou ponto neutro se sem dados. */
function markerEl(p: StationPoint): HTMLElement {
  const el = document.createElement("div");
  const t = p.obs?.temp;
  if (t != null) {
    el.textContent = `${Math.round(t)}°`;
    el.style.cssText = `background:${tempColor(
      t,
    )};color:#fff;font:600 12px/1 system-ui;padding:3px 6px;border-radius:9999px;box-shadow:0 1px 3px rgba(0,0,0,.3);white-space:nowrap`;
  } else {
    el.style.cssText =
      "width:8px;height:8px;border-radius:9999px;background:#94a3b8;box-shadow:0 1px 2px rgba(0,0,0,.3)";
  }
  return el;
}

export function StationsMap({ stations }: { stations: StationPoint[] }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const map = new maplibregl.Map({
      container: container.current,
      style: STYLE,
      center: [-8.0, 39.5],
      zoom: 5.5,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    for (const s of stations) {
      new maplibregl.Marker({ element: markerEl(s) })
        .setLngLat([s.lon, s.lat])
        .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(popupHtml(s)))
        .addTo(map);
    }

    return () => map.remove();
  }, [stations]);

  return (
    <div
      ref={container}
      className="h-[70vh] w-full"
      role="application"
      aria-label="Mapa de observações meteorológicas do IPMA"
    />
  );
}
