import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Requires a disposable local PostgreSQL with migrations applied.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.integration.test.ts"],
    fileParallelism: false,
  },
});
