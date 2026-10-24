import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  // "class": o tema escuro aplica-se quando <html> tem a classe `dark`.
  // O script anti-FOWT em layout.tsx define essa classe a partir da
  // preferência guardada (localStorage) ou de prefers-color-scheme.
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
