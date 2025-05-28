import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: 'localhost',
    port: 8081,
    strictPort: true,
    open: true, // Automatically open the browser
    proxy: {
      // Add any proxy configuration if needed
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "components": path.resolve(__dirname, "./src/components"),
      "contexts": path.resolve(__dirname, "./src/contexts"),
      "lib": path.resolve(__dirname, "./src/lib"),
      "integrations": path.resolve(__dirname, "./src/integrations"),
    },
  },
}));
