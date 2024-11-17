import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgLoader from "vite-svg-loader";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: true,
    cssMinify: true,
    minify: true,
    target: "es2015",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if(id.includes("effect/")) {
            return "effect-ts";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      }
    }
  },
  plugins: [
    react(),
    svgLoader({
      defaultImport: "url",
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 8080,
  },

});
