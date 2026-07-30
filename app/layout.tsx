import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { SiteChrome } from "@/components/site-chrome";
import { StoreProvider } from "@/components/store-context";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  return {
    title: {
      default: "Dela Rosa | El detalle exclusivo",
      template: "%s · Dela Rosa",
    },
    description:
      "Joyas, relojes y regalos para momentos especiales. Comprá por catálogo o reservá tu perforación de oreja en Dela Rosa, Encarnación.",
    icons: {
      icon: "/logo-delarosa-negro.jpg",
      shortcut: "/logo-delarosa-negro.jpg",
    },
    openGraph: {
      title: "Dela Rosa | El detalle exclusivo para ese momento especial",
      description:
        "Joyas, relojes, regalos y reserva de perforación en Encarnación.",
      type: "website",
      locale: "es_PY",
      images: [
        {
          url: `${baseUrl}/og.png`,
          width: 1734,
          height: 907,
          alt: "Dela Rosa — El detalle exclusivo para ese momento especial",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Dela Rosa | El detalle exclusivo",
      description:
        "Joyas, relojes, regalos y reserva de perforación en Encarnación.",
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
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <StoreProvider>
          <SiteChrome>{children}</SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
