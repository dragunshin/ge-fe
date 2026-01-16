import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      // 1. API 요청 프록시 (기존 설정 유지)
      "/api": {
        target: "https://api.menual.site",
        changeOrigin: true,
        secure: false,
      },
      // 2. 웹소켓 요청 프록시 (기존 설정 유지)
      "/ws": {
        target: "https://api.menual.site",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  define: {
    global: "globalThis",
  },
});