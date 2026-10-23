import { weatherTypeLabel } from "@/lib/ipma/weather-types";
import { iconName } from "@/lib/ipma/weather-icons";

/** Noite entre as 20h e as 7h (hora local da previsão do IPMA). */
function isNight(date?: string): boolean {
  if (!date) return false;
  const h = new Date(date).getHours();
  return h >= 20 || h < 7;
}

export function WeatherIcon({
  id,
  date,
  size = 24,
  className,
}: {
  id: number;
  /** Data ISO da previsão, para escolher variante dia/noite. */
  date?: string;
  size?: number;
  className?: string;
}) {
  const { label } = weatherTypeLabel(id);
  const name = iconName(id, isNight(date));
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/icons/${name}.svg`}
      alt={label}
      width={size}
      height={size}
      className={className}
      loading="lazy"
    />
  );
}
