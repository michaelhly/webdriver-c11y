import { defineConfig } from "vitest/config";

/** Default workspace / CI: specs colocated under `src` (no Selenium Grid). */
export default defineConfig({
  test: {
    include: ["src/**/*.spec.ts"],
    environment: "node",
  },
});
