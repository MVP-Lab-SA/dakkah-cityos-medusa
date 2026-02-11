import medusaAiTags from "@medusajs-ai/tags";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import Terminal from "vite-plugin-terminal";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [
      Terminal({ console: "terminal", output: ["terminal"] }),
      viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),

      ...(isDev
        ? [
            medusaAiTags({
              enabled: true,
              includeRuntime: true,
            }),
          ]
        : []),

      tanstackStart({
        target: "node",
        customViteReactPlugin: true,
      }),
      react(),
    ],

    server: {
      host: "0.0.0.0",
      port: 5000,
      allowedHosts: true,
      proxy: {
        "/platform": {
          target: "http://localhost:9000",
          changeOrigin: true,
        },
        "/store": {
          target: "http://localhost:9000",
          changeOrigin: true,
        },
        "/admin": {
          target: "http://localhost:9000",
          changeOrigin: true,
        },
        "/commerce": {
          target: "http://localhost:9000",
          changeOrigin: true,
          ws: true,
        },
        "/auth": {
          target: "http://localhost:9000",
          changeOrigin: true,
        },
      },
    },

    ssr: {
      noExternal: ["@medusajs/js-sdk", "@medusajs/types", "@dakkah-cityos/design-runtime", "@dakkah-cityos/design-tokens", "@dakkah-cityos/design-system"],
      external: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
      optimizeDeps: {
        noDiscovery: true,
        include: [],
      },
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/react-router",
        "@medusajs/js-sdk",
        "@medusajs/icons",
        "lodash-es",
      ],
      exclude: ["@medusajs-ai/tags"],
    },

    resolve: {
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-router", "@tanstack/react-query"],
      alias: {
        react: path.resolve(path.dirname(new URL(import.meta.url).pathname), "node_modules/react"),
        "react-dom": path.resolve(path.dirname(new URL(import.meta.url).pathname), "node_modules/react-dom"),
        "react/jsx-runtime": path.resolve(path.dirname(new URL(import.meta.url).pathname), "node_modules/react/jsx-runtime"),
        "react/jsx-dev-runtime": path.resolve(path.dirname(new URL(import.meta.url).pathname), "node_modules/react/jsx-dev-runtime"),
      },
    },
  };
});
