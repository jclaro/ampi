import { NextResponse } from "next/server";
import { getForecastBySlug } from "@/lib/ipma/forecast";
import { upcomingHours } from "@/lib/ipma/select";
import { nowInPortugal } from "@/lib/time";

export const revalidate = 1800;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const data = await getForecastBySlug(slug);
  if (!data) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const now =
    upcomingHours(data.hourly, nowInPortugal(), 1)[0] ?? data.hourly[0];
  return NextResponse.json(
    { temp: now?.temp ?? null, weatherTypeId: now?.weatherTypeId ?? 0 },
    {
      headers: {
        "Cache-Control": "s-maxage=1800, stale-while-revalidate=86400",
      },
    },
  );
}
