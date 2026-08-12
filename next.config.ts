import type { NextConfig } from "next";

const publicRoutes = [
  "productos",
  "combos",
  "nosotros",
  "reservas",
  "ubicacion",
];

const nextConfig: NextConfig = {
  async redirects() {
    return publicRoutes.map((route) => ({
      source: `/${route}\u2060`,
      destination: `/${route}`,
      permanent: false,
    }));
  },
  images: {
    unoptimized: true,
    qualities: [70, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
