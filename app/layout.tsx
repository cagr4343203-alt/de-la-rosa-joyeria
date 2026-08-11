import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/components/google-analytics";
import { SiteChrome } from "@/components/site-chrome";
import { StoreProvider } from "@/components/store-context";
import { BRAND_ICON_URL, BRAND_PREVIEW_URL, SITE_URL } from "@/lib/seo";
import { getSiteSettings } from "@/sanity/lib/site-content";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Joyería en Encarnación | Dela Rosa Joyería y Relojería",
      template: "%s · Dela Rosa Joyería",
    },
    description:
      "Joyería y relojería en Encarnación, Paraguay. Encontrá joyas de oro 18K, plata 925, relojes, regalos y perforación de oreja en Dela Rosa, desde 2003.",
    icons: {
      icon: [
        { url: BRAND_ICON_URL, type: "image/png", sizes: "512x512" },
        { url: "/favicon.ico", type: "image/x-icon", sizes: "48x48" },
      ],
      shortcut: BRAND_ICON_URL,
      apple: [{ url: BRAND_ICON_URL, type: "image/png", sizes: "512x512" }],
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
      title: "Joyería en Encarnación | Dela Rosa Joyería y Relojería",
      description:
        "Joyas, relojes, regalos y perforación de oreja en Encarnación, Paraguay. Desde 2003 formando parte de tus momentos.",
      url: SITE_URL,
      siteName: "Dela Rosa Joyería",
      type: "website",
      locale: "es_PY",
      images: [
        {
          url: BRAND_PREVIEW_URL,
          width: 1734,
          height: 907,
          alt: "Dela Rosa — El detalle exclusivo para ese momento especial",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Joyería en Encarnación | Dela Rosa Joyería y Relojería",
      description:
        "Joyas, relojes, regalos y perforación de oreja en Encarnación, Paraguay.",
      images: [BRAND_PREVIEW_URL],
    },
  };

export const viewport: Viewport = {
  themeColor: "#17120f",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="es-PY" data-scroll-behavior="smooth">
      <body>
        <StoreProvider whatsappNumber={siteSettings.whatsappNumber}>
          <SiteChrome settings={siteSettings}>{children}</SiteChrome>
        </StoreProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
