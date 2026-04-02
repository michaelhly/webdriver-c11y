import { defineConfig } from "vitest/config";

/** Real browser / Grid integration tests under `tests/`. Run when Grid is available. */
export default defineConfig({
  test: {
    include: ["tests/**/*.spec.ts"],
    environment: "node",
    testTimeout: 30_000,
    bail: 1,
    env: {
      SELENIUM_REMOTE_URL: "http://localhost:4444",
    },
  },
});
