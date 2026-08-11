import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  MAPS_URL,
  STORE_ADDRESS,
  STORE_PHONE,
  TIKTOK_URL,
  WHATSAPP_NUMBER,
} from "./store";

export const SITE_URL = "https://delarosajoyeria.com";
export const SITE_NAME = "Dela Rosa Joyería";
export const BRAND_ICON_URL = `${SITE_URL}/dela-rosa-icon-512.png`;
export const BRAND_PREVIEW_URL = `${SITE_URL}/dela-rosa-google-preview.png`;

export const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: ["Dela Rosa", "Dela Rosa Joyería y Relojería"],
  inLanguage: "es-PY",
  publisher: {
    "@id": `${SITE_URL}/#joyeria`,
  },
};

export const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "@id": `${SITE_URL}/#joyeria`,
  name: SITE_NAME,
  alternateName: "Dela Rosa Joyería y Relojería",
  description:
    "Joyería, relojería, regalos y perforación de oreja en Encarnación, Paraguay. Desde 2003 formando parte de tus momentos.",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: BRAND_ICON_URL,
    contentUrl: BRAND_ICON_URL,
    width: 512,
    height: 512,
    caption: SITE_NAME,
  },
  image: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#primaryimage`,
    url: BRAND_PREVIEW_URL,
    contentUrl: BRAND_PREVIEW_URL,
    width: 1734,
    height: 907,
    caption: "Dela Rosa Joyería y Relojería en Encarnación",
  },
  foundingDate: "2003",
  telephone: STORE_PHONE,
  address: {
    "@type": "PostalAddress",
    streetAddress: STORE_ADDRESS,
    addressLocality: "Encarnación",
    postalCode: "6000",
    addressCountry: "PY",
  },
  hasMap: MAPS_URL,
  areaServed: {
    "@type": "City",
    name: "Encarnación",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "12:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "15:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "13:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "15:00",
      closes: "19:00",
    },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: STORE_PHONE,
      contactType: "customer service",
      availableLanguage: "Spanish",
    },
    {
      "@type": "ContactPoint",
      telephone: `+${WHATSAPP_NUMBER}`,
      contactType: "sales",
      availableLanguage: "Spanish",
    },
  ],
  sameAs: [INSTAGRAM_URL, FACEBOOK_URL, TIKTOK_URL],
};

export const HOME_PAGE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: "Joyería en Encarnación | Dela Rosa Joyería y Relojería",
  description:
    "Joyas de oro 18K y plata 925, relojes, regalos y perforación de oreja en Encarnación, Paraguay.",
  inLanguage: "es-PY",
  isPartOf: {
    "@id": `${SITE_URL}/#website`,
  },
  about: {
    "@id": `${SITE_URL}/#joyeria`,
  },
  primaryImageOfPage: {
    "@id": `${SITE_URL}/#primaryimage`,
  },
};

export const INDEXABLE_ROUTES = [
  "",
  "/productos",
  "/combos",
  "/nosotros",
  "/reservas",
  "/ubicacion",
] as const;
