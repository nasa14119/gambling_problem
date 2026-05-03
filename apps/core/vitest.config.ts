import { defineConfig, defaultExclude } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...defaultExclude, "**/node_modules/**", "Deck/lib/**"],
  },
});
