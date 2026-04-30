import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // vite.config.js
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "./src/core"),
      "@store": path.resolve(__dirname, "./src/features/editor/store"),
      "@hooks": path.resolve(__dirname, "./src/features/editor/hooks"), // Hooks específicos del editor
      "@editor": path.resolve(__dirname, "./src/features/editor"),

      "@config": path.resolve(
        __dirname,
        "./src/features/editor/components/config",
      ),
      "@writer": path.resolve(
        __dirname,
        "./src/features/editor/components/writer",
      ),
      "@logic": path.resolve(__dirname, "./src/features/editor/logic"),

      "@pages": path.resolve(__dirname, "./src/pages"),
    },
  },
});
