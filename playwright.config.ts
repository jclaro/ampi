import { defineConfig, devices } from "@playwright/test";

const PORT = 3177;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices["Pixel 5"], // viewport mobile 360px-ish por omissão
  },
  webServer: {
    command: `npm run build && PORT=${PORT} npm run start`,
    port: PORT,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
