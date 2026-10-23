import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="pt" className={inter.variable}>
      <body className="min-h-dvh bg-white font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <NavBar />
        <div className="pb-16 sm:pb-0">{children}</div>
      </body>
    </html>
  );
}
