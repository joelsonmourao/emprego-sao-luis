import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import process from "node:process";

export default defineConfig({
  site: process.env.SITE_URL ?? "http://localhost:4321",
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  security: {
    checkOrigin: true,
    allowedDomains: [
      {
        protocol: "https",
        hostname: "empregossaoluis.com.br"
      },
      {
        protocol: "https",
        hostname: "www.empregossaoluis.com.br"
      }
    ]
  }
});
