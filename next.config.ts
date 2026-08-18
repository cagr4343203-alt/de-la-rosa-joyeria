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
    deviceSizes: [320, 384, 480, 640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
