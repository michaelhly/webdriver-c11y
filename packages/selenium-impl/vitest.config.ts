import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 120_000,
    env: {
      SELENIUM_REMOTE_URL: "http://localhost:4444",
    },
  },
});
