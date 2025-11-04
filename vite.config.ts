import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "public",
  define: {
    global: "globalThis",
    "process.env": {},
  },
  resolve: {
    alias: {
      process: "process/browser",
    },
  },
});
