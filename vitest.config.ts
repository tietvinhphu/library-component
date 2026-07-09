import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      reportOnFailure: true,
      include: [
        "registry/**/*.tsx",
        "src/lib/**/*.ts",
        "src/components/**/*.tsx",
        "src/app/components/**/*.tsx",
        "src/app/notes/**/*.tsx",
      ],
      exclude: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "src/components/ui/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@/registry": path.resolve(__dirname, "./registry"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
