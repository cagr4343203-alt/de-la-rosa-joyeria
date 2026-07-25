import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  return {
    title: "De la Rosa | Joyas que hablan de vos",
    description:
      "Joyas de oro, plata, acero y relojería. Descubrí la colección de De la Rosa en Encarnación y armá tu pedido por WhatsApp.",
    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
    },
    openGraph: {
      title: "De la Rosa | Joyas que hablan de vos",
      description:
        "Oro, plata y relojería con atención personalizada en Encarnación.",
      type: "website",
      locale: "es_PY",
      images: [
        {
          url: `${baseUrl}/og.png`,
          width: 1734,
          height: 907,
          alt: "De la Rosa — Joyas que hablan de vos",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "De la Rosa | Joyas que hablan de vos",
      description:
        "Oro, plata y relojería con atención personalizada en Encarnación.",
      images: [`${baseUrl}/og.png`],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#17120f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
