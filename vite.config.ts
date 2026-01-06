import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? "/ss-dummy-ui-app/" : "/",   // 👈 github repo
  server: {
    port: 5173,
    host: true,
  },
}));