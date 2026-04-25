import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
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
