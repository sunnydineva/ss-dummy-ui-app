import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/ss-dummy-ui-app/",   // 👈 github repo
  server: {
    port: 5173,
    host: true,
  },

});