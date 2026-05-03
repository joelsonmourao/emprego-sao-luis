import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * `outputFileTracingRoot` só faz sentido quando o app vive em `.../apps/<este-pacote>/`
 * dentro de um monorepo. No Docker/Coolify com repositório só na raiz (`/app`),
 * `path.join(__dirname, "../..")` aponta para `/` e o `next build` pode falhar (exit 255).
 */
const monorepoRoot = path.resolve(__dirname, "..", "..");
const isMonorepoAppLayout =
  path.basename(path.dirname(__dirname)) === "apps" && fs.existsSync(path.join(monorepoRoot, "package.json"));

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  ...(isMonorepoAppLayout ? { outputFileTracingRoot: monorepoRoot } : {}),
  allowedDevOrigins: ["http://127.0.0.1:3000", "http://localhost:3000"],
  async redirects() {
    return [
      {
        source: "/cidade/:slug",
        destination: "/vagas/cidade/:slug",
        permanent: true
      },
      {
        source: "/vaga/:slug/:id",
        destination: "/vagas",
        permanent: true
      },
      {
        source: "/ceara-ce",
        destination: "/vagas/estado/ce",
        permanent: true
      },
      {
        source: "/empresa/:slug",
        destination: "/empresa/:slug/jovem-aprendiz",
        permanent: true
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
};

export default nextConfig;
