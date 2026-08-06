import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/components/google-analytics";
import { SiteChrome } from "@/components/site-chrome";
import { StoreProvider } from "@/components/store-context";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Dela Rosa Joyería y Relojería | Encarnación",
      template: "%s · Dela Rosa Joyería",
    },
    description:
      "Dela Rosa Joyería y Relojería en Encarnación, Paraguay. Joyas de oro y plata, relojes, regalos, bombillas, bolígrafos y perforación de oreja desde 2003.",
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
      shortcut: "/favicon.png",
      apple: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
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
      title: "Dela Rosa Joyería y Relojería en Encarnación",
      description:
        "Joyas, relojes, regalos y perforación de oreja en Encarnación, Paraguay. Desde 2003 formando parte de tus momentos.",
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
      title: "Dela Rosa Joyería y Relojería en Encarnación",
      description:
        "Joyas, relojes, regalos y perforación de oreja en Encarnación, Paraguay.",
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
        <GoogleAnalytics />
      </body>
    </html>
  );
}
