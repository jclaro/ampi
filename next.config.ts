import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz neste projeto: sem isto, um package-lock.json numa pasta acima
  // faz o Next inferir a raiz errada.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
