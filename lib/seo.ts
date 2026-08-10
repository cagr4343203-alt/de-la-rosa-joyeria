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
  logo: `${SITE_URL}/logo-delarosa-negro.jpg`,
  image: [`${SITE_URL}/favicon.png`, `${SITE_URL}/og.png`],
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

export const INDEXABLE_ROUTES = [
  "",
  "/productos",
  "/combos",
  "/nosotros",
  "/reservas",
  "/ubicacion",
] as const;
