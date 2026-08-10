import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { defineQuery } from "next-sanity";
import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  MAPS_URL,
  STORE_ADDRESS,
  STORE_HOURS,
  STORE_PHONE,
  TIKTOK_URL,
  WHATSAPP_NUMBER,
} from "@/lib/store";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export type SiteSettings = {
  brandName: string;
  brandTagline: string;
  whatsappNumber: string;
  phone: string;
  address: string;
  mapsUrl: string;
  instagramUrl: string;
  instagramLabel: string;
  tiktokUrl: string;
  tiktokLabel: string;
  facebookUrl: string;
  facebookLabel: string;
  promotionsKicker: string;
  promotionsTitle: string;
  promotionsDescription: string;
  hours: Array<{ _key: string; days: string; times: string[] }>;
};

type ContentImage = {
  src: string;
  alt: string;
};

export type ReservationContent = {
  kicker: string;
  title: string;
  emphasis: string;
  description: string;
  benefits: Array<{
    _key: string;
    icon: "shield" | "clock" | "sparkles";
    title: string;
  }>;
  referenceImage: ContentImage;
  referenceEyebrow: string;
  referenceTitle: string;
  referenceDescription: string;
  formEyebrow: string;
  formTitle: string;
  nameLabel: string;
  namePlaceholder: string;
  serviceLabel: string;
  dateLabel: string;
  timeLabel: string;
  notesLabel: string;
  notesPlaceholder: string;
  serviceOptions: string[];
  buttonLabel: string;
  paymentNotice: string;
  whatsappIntro: string;
  whatsappOutro: string;
  stepsKicker: string;
  stepsTitle: string;
  steps: Array<{
    _key: string;
    icon: "calendar" | "message" | "sparkles";
    title: string;
    description: string;
  }>;
};

export type AboutContent = {
  heroImage: ContentImage;
  foundingYear: string;
  kicker: string;
  title: string;
  description: string;
  proofPoints: Array<{ _key: string; value: string; label: string }>;
  buttonLabel: string;
  values: Array<{
    _key: string;
    icon: "gem" | "heart" | "sparkles";
    title: string;
    description: string;
  }>;
  socialKicker: string;
  socialTitle: string;
};

export type LocationContent = {
  kicker: string;
  title: string;
  description: string;
  hoursFeature: string;
  hoursTitle: string;
  mapsButtonLabel: string;
  whatsappButtonLabel: string;
  whatsappMessage: string;
  mapTitle: string;
  mapSubtitle: string;
  mapFooterLabel: string;
};

const FALLBACK_SETTINGS: SiteSettings = {
  brandName: "DELA ROSA",
  brandTagline: "Joyería · Relojería",
  whatsappNumber: WHATSAPP_NUMBER,
  phone: STORE_PHONE,
  address: STORE_ADDRESS,
  mapsUrl: MAPS_URL,
  instagramUrl: INSTAGRAM_URL,
  instagramLabel: "@dela_rosajoyeria",
  tiktokUrl: TIKTOK_URL,
  tiktokLabel: "@delarosa.joyeria",
  facebookUrl: FACEBOOK_URL,
  facebookLabel: "Dela Rosa Joyería",
  promotionsKicker: "Beneficios vigentes",
  promotionsTitle: "Promociones para elegir tu detalle",
  promotionsDescription:
    "Aprovechá beneficios con tarjetas seleccionadas. Consultá siempre vigencia y condiciones.",
  hours: STORE_HOURS.map((schedule, index) => ({
    _key: `fallback-hours-${index}`,
    days: schedule.days,
    times: [...schedule.times],
  })),
};

const FALLBACK_RESERVATION: ReservationContent = {
  kicker: "Perforación de oreja · Con reserva",
  title: "Elegí tu momento.",
  emphasis: "Nosotros cuidamos cada detalle.",
  description:
    "Completá tus preferencias y enviaremos la solicitud por WhatsApp. La reserva queda confirmada cuando el equipo de Dela Rosa te responde.",
  benefits: [
    { _key: "care", icon: "shield", title: "Orientación y cuidado" },
    { _key: "time", icon: "clock", title: "Horario coordinado" },
    { _key: "attention", icon: "sparkles", title: "Atención personalizada" },
  ],
  referenceImage: {
    src: "/products/piercing-reference-client.png",
    alt: "Perforación de oreja realizada con aros plateados",
  },
  referenceEyebrow: "Imagen de referencia",
  referenceTitle: "Inspiración para elegir tu estilo",
  referenceDescription:
    "El equipo te orientará sobre las opciones disponibles durante la confirmación de tu reserva.",
  formEyebrow: "Solicitud de reserva",
  formTitle: "Perforación de oreja",
  nameLabel: "Nombre y apellido *",
  namePlaceholder: "Tu nombre",
  serviceLabel: "Servicio *",
  dateLabel: "Fecha preferida *",
  timeLabel: "Horario preferido *",
  notesLabel: "Observaciones",
  notesPlaceholder: "Contanos si tenés alguna preferencia o consulta.",
  serviceOptions: ["Una perforación", "Dos perforaciones", "Consulta previa"],
  buttonLabel: "Solicitar reserva por WhatsApp",
  paymentNotice: "No se realiza ningún cobro desde esta página.",
  whatsappIntro:
    "Hola Dela Rosa ✨ Quiero solicitar una reserva para perforación de oreja.",
  whatsappOutro:
    "¿Me confirman disponibilidad, indicaciones y precio final, por favor?",
  stepsKicker: "Cómo reservar",
  stepsTitle: "Simple, rápido y acompañado",
  steps: [
    {
      _key: "choose",
      icon: "calendar",
      title: "Elegí fecha y horario",
      description: "Indicá cuándo preferís visitar el local.",
    },
    {
      _key: "confirm",
      icon: "message",
      title: "Confirmamos por WhatsApp",
      description: "El equipo revisa la agenda y confirma contigo.",
    },
    {
      _key: "visit",
      icon: "sparkles",
      title: "Vení a Dela Rosa",
      description: "Recibí orientación e indicaciones para tu visita.",
    },
  ],
};

const FALLBACK_ABOUT: AboutContent = {
  heroImage: {
    src: "/logo-delarosa-negro.jpg",
    alt: "Logo de Dela Rosa Joyería y Relojería",
  },
  foundingYear: "2003",
  kicker: "Nuestra historia",
  title: "Desde el 2003 formando parte de tus momentos.",
  description:
    "Gracias por elegirnos para convertir un detalle en un recuerdo. En Dela Rosa seleccionamos joyas, relojes y regalos con una atención cercana y personalizada.",
  proofPoints: [
    { _key: "years", value: "+20 años", label: "acompañando momentos" },
    { _key: "city", value: "Encarnación", label: "nuestra casa" },
  ],
  buttonLabel: "Conocer productos",
  values: [
    {
      _key: "selection",
      icon: "gem",
      title: "Selección",
      description: "Piezas elegidas para celebrar momentos únicos.",
    },
    {
      _key: "closeness",
      icon: "heart",
      title: "Cercanía",
      description: "Te acompañamos a encontrar el detalle indicado.",
    },
    {
      _key: "experience",
      icon: "sparkles",
      title: "Experiencia",
      description: "Más de dos décadas formando parte de Encarnación.",
    },
  ],
  socialKicker: "Seguinos",
  socialTitle: "Descubrí novedades y piezas recién llegadas.",
};

const FALLBACK_LOCATION: LocationContent = {
  kicker: "El local",
  title: "Vení a conocernos",
  description:
    "Te esperamos en el centro de Encarnación para asesorarte de forma personalizada.",
  hoursFeature: "Horarios actualizados",
  hoursTitle: "Horario de atención",
  mapsButtonLabel: "Abrir Google Maps",
  whatsappButtonLabel: "Consultar horario",
  whatsappMessage:
    "Hola Dela Rosa, quiero consultar el horario para visitar el local.",
  mapTitle: "DELA ROSA",
  mapSubtitle: "Mariscal José Félix Estigarribia",
  mapFooterLabel: "Abrir ubicación",
};

const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    brandName,
    brandTagline,
    whatsappNumber,
    phone,
    address,
    mapsUrl,
    instagramUrl,
    instagramLabel,
    tiktokUrl,
    tiktokLabel,
    facebookUrl,
    facebookLabel,
    promotionsKicker,
    promotionsTitle,
    promotionsDescription,
    hours[]{_key, days, times}
  }
`);

const RESERVATION_QUERY = defineQuery(`
  *[_id == "reservationPage"][0]{
    kicker,
    title,
    emphasis,
    description,
    benefits[]{_key, icon, title},
    referenceImage,
    referenceEyebrow,
    referenceTitle,
    referenceDescription,
    formEyebrow,
    formTitle,
    nameLabel,
    namePlaceholder,
    serviceLabel,
    dateLabel,
    timeLabel,
    notesLabel,
    notesPlaceholder,
    serviceOptions,
    buttonLabel,
    paymentNotice,
    whatsappIntro,
    whatsappOutro,
    stepsKicker,
    stepsTitle,
    steps[]{_key, icon, title, description}
  }
`);

const ABOUT_QUERY = defineQuery(`
  *[_id == "aboutPage"][0]{
    heroImage,
    foundingYear,
    kicker,
    title,
    description,
    proofPoints[]{_key, value, label},
    buttonLabel,
    values[]{_key, icon, title, description},
    socialKicker,
    socialTitle
  }
`);

const LOCATION_QUERY = defineQuery(`
  *[_id == "locationPage"][0]{
    kicker,
    title,
    description,
    hoursFeature,
    hoursTitle,
    mapsButtonLabel,
    whatsappButtonLabel,
    whatsappMessage,
    mapTitle,
    mapSubtitle,
    mapFooterLabel
  }
`);

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function url(value: unknown, fallback: string) {
  return typeof value === "string" && /^https?:\/\//.test(value)
    ? value
    : fallback;
}

function image(
  value: (SanityImageSource & { alt?: string }) | undefined,
  fallback: ContentImage,
): ContentImage {
  if (!value) return fallback;

  try {
    return {
      src: builder.image(value).width(1600).auto("format").url(),
      alt: text(value.alt, fallback.alt),
    };
  } catch {
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const entry = await sanityClient.fetch<Record<string, unknown> | null>(
      SITE_SETTINGS_QUERY,
      {},
      { next: { revalidate: 30, tags: ["site-settings"] } },
    );

    if (!entry) return FALLBACK_SETTINGS;

    const rawHours = Array.isArray(entry.hours) ? entry.hours : [];
    const hours = rawHours.flatMap((item, index) => {
      if (!item || typeof item !== "object") return [];
      const current = item as Record<string, unknown>;
      const times = Array.isArray(current.times)
        ? current.times.filter(
            (time): time is string => typeof time === "string" && Boolean(time.trim()),
          )
        : [];

      if (!times.length) return [];

      return [{
        _key: text(current._key, `hours-${index}`),
        days: text(current.days, "Horario"),
        times,
      }];
    });

    return {
      brandName: text(entry.brandName, FALLBACK_SETTINGS.brandName),
      brandTagline: text(entry.brandTagline, FALLBACK_SETTINGS.brandTagline),
      whatsappNumber: text(
        entry.whatsappNumber,
        FALLBACK_SETTINGS.whatsappNumber,
      ).replace(/\D/g, ""),
      phone: text(entry.phone, FALLBACK_SETTINGS.phone),
      address: text(entry.address, FALLBACK_SETTINGS.address),
      mapsUrl: url(entry.mapsUrl, FALLBACK_SETTINGS.mapsUrl),
      instagramUrl: url(entry.instagramUrl, FALLBACK_SETTINGS.instagramUrl),
      instagramLabel: text(
        entry.instagramLabel,
        FALLBACK_SETTINGS.instagramLabel,
      ),
      tiktokUrl: url(entry.tiktokUrl, FALLBACK_SETTINGS.tiktokUrl),
      tiktokLabel: text(entry.tiktokLabel, FALLBACK_SETTINGS.tiktokLabel),
      facebookUrl: url(entry.facebookUrl, FALLBACK_SETTINGS.facebookUrl),
      facebookLabel: text(
        entry.facebookLabel,
        FALLBACK_SETTINGS.facebookLabel,
      ),
      promotionsKicker: text(
        entry.promotionsKicker,
        FALLBACK_SETTINGS.promotionsKicker,
      ),
      promotionsTitle: text(
        entry.promotionsTitle,
        FALLBACK_SETTINGS.promotionsTitle,
      ),
      promotionsDescription: text(
        entry.promotionsDescription,
        FALLBACK_SETTINGS.promotionsDescription,
      ),
      hours: hours.length ? hours : FALLBACK_SETTINGS.hours,
    };
  } catch {
    return FALLBACK_SETTINGS;
  }
}

export async function getReservationContent(): Promise<ReservationContent> {
  try {
    const entry = await sanityClient.fetch<Record<string, unknown> | null>(
      RESERVATION_QUERY,
      {},
      { next: { revalidate: 30, tags: ["reservation-page"] } },
    );

    if (!entry) return FALLBACK_RESERVATION;

    return {
      ...FALLBACK_RESERVATION,
      ...entry,
      kicker: text(entry.kicker, FALLBACK_RESERVATION.kicker),
      title: text(entry.title, FALLBACK_RESERVATION.title),
      emphasis: text(entry.emphasis, FALLBACK_RESERVATION.emphasis),
      description: text(entry.description, FALLBACK_RESERVATION.description),
      referenceImage: image(
        entry.referenceImage as (SanityImageSource & { alt?: string }) | undefined,
        FALLBACK_RESERVATION.referenceImage,
      ),
      serviceOptions:
        Array.isArray(entry.serviceOptions) && entry.serviceOptions.length
          ? entry.serviceOptions.filter((item): item is string => typeof item === "string")
          : FALLBACK_RESERVATION.serviceOptions,
      benefits:
        Array.isArray(entry.benefits) && entry.benefits.length
          ? (entry.benefits as ReservationContent["benefits"])
          : FALLBACK_RESERVATION.benefits,
      steps:
        Array.isArray(entry.steps) && entry.steps.length
          ? (entry.steps as ReservationContent["steps"])
          : FALLBACK_RESERVATION.steps,
    } as ReservationContent;
  } catch {
    return FALLBACK_RESERVATION;
  }
}

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const entry = await sanityClient.fetch<Record<string, unknown> | null>(
      ABOUT_QUERY,
      {},
      { next: { revalidate: 30, tags: ["about-page"] } },
    );

    if (!entry) return FALLBACK_ABOUT;

    return {
      ...FALLBACK_ABOUT,
      ...entry,
      heroImage: image(
        entry.heroImage as (SanityImageSource & { alt?: string }) | undefined,
        FALLBACK_ABOUT.heroImage,
      ),
      proofPoints:
        Array.isArray(entry.proofPoints) && entry.proofPoints.length
          ? (entry.proofPoints as AboutContent["proofPoints"])
          : FALLBACK_ABOUT.proofPoints,
      values:
        Array.isArray(entry.values) && entry.values.length
          ? (entry.values as AboutContent["values"])
          : FALLBACK_ABOUT.values,
    } as AboutContent;
  } catch {
    return FALLBACK_ABOUT;
  }
}

export async function getLocationContent(): Promise<LocationContent> {
  try {
    const entry = await sanityClient.fetch<Record<string, unknown> | null>(
      LOCATION_QUERY,
      {},
      { next: { revalidate: 30, tags: ["location-page"] } },
    );

    if (!entry) return FALLBACK_LOCATION;

    return Object.fromEntries(
      Object.entries(FALLBACK_LOCATION).map(([key, fallback]) => [
        key,
        text(entry[key], fallback),
      ]),
    ) as LocationContent;
  } catch {
    return FALLBACK_LOCATION;
  }
}
