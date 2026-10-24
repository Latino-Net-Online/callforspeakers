import { readFileSync } from "node:fs";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// The deploy workflow injects the public URL into package.json "homepage".
const { homepage } = JSON.parse(readFileSync("./package.json", "utf-8"));
const base = homepage ? new URL(homepage, "http://localhost").pathname.replace(/\/?$/, "/") : "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: { port: 3000, open: true },
  build: { outDir: "build" },
  test: { environment: "jsdom" },
});
