import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    hookTimeout: 120_000,
    testTimeout: 120_000
  },
  resolve: {
    alias: {
      "@bridgeed/shared": path.resolve(currentDir, "../../packages/shared/src/index.ts")
    }
  }
});
