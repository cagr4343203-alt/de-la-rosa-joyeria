import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dela Rosa Joyería y Relojería",
    short_name: "Dela Rosa",
    description:
      "Joyas, relojes, regalos y perforación de oreja en Encarnación.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f1e8",
    theme_color: "#17120f",
    lang: "es-PY",
    icons: [
      {
        src: "/dela-rosa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
