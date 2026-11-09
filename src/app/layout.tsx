import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { TopBar } from "@/components/TopBar";
import { SiteFooter } from "@/components/SiteFooter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Cloudflare Web Analytics: sem cookies. O token é público (fica visível no HTML).
const CF_ANALYTICS_TOKEN = "bf53af3c803b448fa2a90767cafe7958";

export const metadata: Metadata = {
  title: "AMPI — Meteorologia de Portugal",
  description:
    "Visualização alternativa e mobile-first dos dados do IPMA (Instituto Português do Mar e da Atmosfera).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Anti-FOWT: aplica o tema ANTES da pintura, a partir da preferência
            guardada ou de prefers-color-scheme. "theme" pode ser "light",
            "dark" ou ausente (= seguir o sistema). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-white font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <TopBar />
        <NavBar />
        <div className="pb-24 sm:pb-0">{children}</div>
        <SiteFooter />
        {process.env.NODE_ENV === "production" && (
          <Script
            type="module"
            crossOrigin="anonymous"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: CF_ANALYTICS_TOKEN })}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
