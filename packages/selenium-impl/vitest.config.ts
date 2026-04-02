import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 30_000,
    bail: 1,
    env: {
      SELENIUM_REMOTE_URL: "http://localhost:4444",
    },
  },
});
