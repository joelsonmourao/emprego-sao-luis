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
        source: "/menor-aprendiz",
        destination: "/vagas",
        permanent: true
      },
      {
        source: "/vagas/jovem-aprendiz/:path*",
        destination: "/vagas",
        permanent: true
      },
      {
        source: "/vagas/jovem-aprendiz-comercial-sao-luis-ma",
        destination: "/vagas/jovem-aprendiz-comercial",
        permanent: true
      },
      {
        source: "/cidades",
        destination: "/vagas",
        permanent: true
      },
      {
        source: "/estados",
        destination: "/vagas",
        permanent: true
      },
      {
        source: "/estados/:path*",
        destination: "/vagas",
        permanent: true
      },
      {
        source: "/vagas/estado/:path*",
        destination: "/vagas",
        permanent: true
      },
      {
        source: "/ceara-ce",
        destination: "/vagas",
        permanent: true
      },
      {
        source: "/empresa/:slug/jovem-aprendiz",
        destination: "/empresas/:slug",
        permanent: true
      },
      {
        source: "/empresa/:slug",
        destination: "/empresas/:slug",
        permanent: true
      },
      {
        source: "/politica-de-privacidade",
        destination: "/privacidade",
        permanent: true
      },
      {
        source: "/politica-de-cookies",
        destination: "/cookies",
        permanent: true
      },
      {
        source: "/termos-de-uso",
        destination: "/termos",
        permanent: true
      },
      {
        source: "/admin/importacao",
        destination: "/admin/importar",
        permanent: false
      },
      {
        source: "/blog/como-conseguir-vaga-de-jovem-aprendiz-em-sao-luis",
        destination: "/blog/como-buscar-vagas-de-jovem-aprendiz-em-sao-luis",
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
