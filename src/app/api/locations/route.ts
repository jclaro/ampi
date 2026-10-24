import { NextResponse } from "next/server";
import { getLocationOptions } from "@/lib/ipma/forecast";

export const revalidate = 86400;

/**
 * Lista de localidades (nome + slug + coords) para a pesquisa global na
 * NavBar em desktop. É praticamente estática → cache agressiva na CDN.
 */
export async function GET() {
  const options = await getLocationOptions();
  return NextResponse.json(options, {
    headers: {
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
