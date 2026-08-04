import type { Metadata, Viewport } from "next";
import { SiteChrome } from "@/components/site-chrome";
import { StoreProvider } from "@/components/store-context";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
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
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: "Dela Rosa | El detalle exclusivo para ese momento especial",
      description:
        "Joyas, relojes, regalos y reserva de perforación en Encarnación.",
      url: SITE_URL,
      siteName: "Dela Rosa Joyería",
      type: "website",
      locale: "es_PY",
      images: [
        {
          url: "/og.png",
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
      images: ["/og.png"],
    },
  };

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
    <html lang="es-PY" data-scroll-behavior="smooth">
      <body>
        <StoreProvider>
          <SiteChrome>{children}</SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
