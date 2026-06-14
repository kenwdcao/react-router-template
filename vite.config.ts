import { reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  optimizeDeps: {
    // Pre-declare the AI SDK packages so Vite optimizes them (and their shared
    // ESM chunks) up front. Without this, Vite discovers them on demand when
    // `/dashboard/chat` is first hit and triggers a mid-session re-optimization
    // + reload, which leaves the browser referencing chunk hashes that no
    // longer exist in `.vite/deps` ("The file does not exist ... .vite/deps").
    include: ["ai", "@ai-sdk/openai-compatible", "@ai-sdk/react"],
  },
});
