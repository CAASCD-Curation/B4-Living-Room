import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 部署平台会丢失子目录文件：public 资源全部平铺到根目录，JS/CSS 也不进 assets/
  publicDir: "public_root",
  build: {
    assetsDir: "",
  },
});
