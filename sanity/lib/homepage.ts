import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { defineQuery } from "next-sanity";
import { STORE_ADDRESS } from "@/lib/store";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

type EditableImage = SanityImageSource & { alt?: string };

export type HomeImage = {
  src: string;
  alt: string;
};

export type HomeServiceIcon = "gem" | "watch" | "gift" | "calendar";

export type HomePageContent = {
  hero: {
    kicker: string;
    title: string;
    emphasis: string;
    description: string;
    primaryActionLabel: string;
    secondaryActionLabel: string;
    trustFirst: string;
    trustSecond: string;
    mainImage: HomeImage;
    secondaryImage: HomeImage;
    reserveEyebrow: string;
    reserveTitle: string;
  };
  services: {
    items: Array<{
      _key: string;
      icon: HomeServiceIcon;
      title: string;
      description: string;
    }>;
  };
  categories: {
    kicker: string;
    title: string;
    linkLabel: string;
    cards: Array<{
      _key: string;
      category: string;
      title: string;
      eyebrow: string;
      image: HomeImage;
    }>;
  };
  featured: {
    kicker: string;
    title: string;
    description: string;
    productIds: string[];
  };
  piercing: {
    kicker: string;
    title: string;
    description: string;
    firstPoint: string;
    secondPoint: string;
    buttonLabel: string;
    image: HomeImage;
    captionEyebrow: string;
    captionTitle: string;
  };
  history: {
    kicker: string;
    title: string;
    description: string;
    linkLabel: string;
    image: HomeImage;
  };
  location: {
    kicker: string;
    title: string;
    description: string;
    mapLabel: string;
    whatsappLabel: string;
  };
};

const HOMEPAGE_QUERY = defineQuery(`
  {
    "hero": *[_id == "homeHero"][0]{
      kicker,
      title,
      emphasis,
      description,
      primaryActionLabel,
      secondaryActionLabel,
      trustFirst,
      trustSecond,
      mainImage,
      secondaryImage,
      reserveEyebrow,
      reserveTitle
    },
    "services": *[_id == "homeServices"][0]{
      items[]{_key, icon, title, description}
    },
    "categories": *[_id == "homeCategories"][0]{
      kicker,
      title,
      linkLabel,
      cards[]{_key, category, title, eyebrow, image}
    },
    "featured": *[_id == "homeFeatured"][0]{
      kicker,
      title,
      description,
      "productIds": products[]._ref
    },
    "piercing": *[_id == "homePiercing"][0]{
      kicker,
      title,
      description,
      firstPoint,
      secondPoint,
      buttonLabel,
      image,
      captionEyebrow,
      captionTitle
    },
    "history": *[_id == "homeHistory"][0]{
      kicker,
      title,
      description,
      linkLabel,
      image
    },
    "location": *[_id == "homeLocation"][0]{
      kicker,
      title,
      description,
      mapLabel,
      whatsappLabel
    }
  }
`);

type RawHomePage = {
  hero?: Partial<HomePageContent["hero"]> & {
    mainImage?: EditableImage;
    secondaryImage?: EditableImage;
  };
  services?: {
    items?: HomePageContent["services"]["items"];
  };
  categories?: Partial<Omit<HomePageContent["categories"], "cards">> & {
    cards?: Array<
      Omit<HomePageContent["categories"]["cards"][number], "image"> & {
        image?: EditableImage;
      }
    >;
  };
  featured?: Partial<HomePageContent["featured"]>;
  piercing?: Partial<HomePageContent["piercing"]> & {
    image?: EditableImage;
  };
  history?: Partial<HomePageContent["history"]> & {
    image?: EditableImage;
  };
  location?: Partial<HomePageContent["location"]>;
};

export const defaultHomePage: HomePageContent = {
  hero: {
    kicker: "Dela Rosa Joyería · Encarnación · Desde 2003",
    title: "El detalle exclusivo",
    emphasis: "para ese momento especial.",
    description:
      "Joyas, relojes y regalos seleccionados para acompañar historias que merecen ser recordadas.",
    primaryActionLabel: "Ver productos",
    secondaryActionLabel: "Reservar perforación",
    trustFirst: "Oro, plata y relojería",
    trustSecond: "Atención personalizada",
    mainImage: {
      src: "/products/06-joya.jpg",
      alt: "Anillos de Dela Rosa",
    },
    secondaryImage: {
      src: "/products/05-pulsera.jpg",
      alt: "Pulsera de Dela Rosa",
    },
    reserveEyebrow: "Agenda disponible",
    reserveTitle: "Reservá tu perforación",
  },
  services: {
    items: [
      {
        _key: "jewelry",
        icon: "gem",
        title: "Joyas seleccionadas",
        description: "Oro 18K, plata y enchapados",
      },
      {
        _key: "watches",
        icon: "watch",
        title: "Relojes",
        description: "Modelos clásicos y contemporáneos",
      },
      {
        _key: "gifts",
        icon: "gift",
        title: "Regalos especiales",
        description: "Bombillas, bolígrafos y más detalles",
      },
      {
        _key: "piercing",
        icon: "calendar",
        title: "Perforación de oreja",
        description: "Reservá fecha y horario por WhatsApp",
      },
    ],
  },
  categories: {
    kicker: "Comprar por categoría",
    title: "Encontrá ese detalle especial",
    linkLabel: "Ver todo el catálogo",
    cards: [
      {
        _key: "rings",
        category: "Anillos",
        title: "Anillos",
        eyebrow: "Momentos únicos",
        image: {
          src: "/products/06-joya.jpg",
          alt: "Anillos de Dela Rosa",
        },
      },
      {
        _key: "earrings",
        category: "Aros",
        title: "Aros",
        eyebrow: "Brillo cotidiano",
        image: {
          src: "/products/04-aros.jpg",
          alt: "Aros de Dela Rosa",
        },
      },
      {
        _key: "straws",
        category: "Bombillas",
        title: "Bombillas",
        eyebrow: "Detalles para regalar",
        image: {
          src: "/products/gifts/bombilla-04.jpg",
          alt: "Bombilla de Dela Rosa",
        },
      },
      {
        _key: "bracelets",
        category: "Pulseras",
        title: "Pulseras",
        eyebrow: "Plata 925 bañada en oro",
        image: {
          src: "/products/client/pulsera-tennis-gold.jpeg",
          alt: "Pulsera de Dela Rosa",
        },
      },
    ],
  },
  featured: {
    kicker: "Selección Dela Rosa",
    title: "Productos destacados",
    description:
      "Agregá tus favoritos al carrito o consultá la disponibilidad directamente por WhatsApp.",
    productIds: [],
  },
  piercing: {
    kicker: "Reserva de perforación",
    title: "Tu nuevo brillo, con atención personalizada.",
    description:
      "Elegí fecha, horario y cantidad de perforaciones. Preparamos tu solicitud y la confirmamos contigo por WhatsApp.",
    firstPoint: "Reserva rápida",
    secondPoint: "Cuidado y orientación",
    buttonLabel: "Reservar ahora",
    image: {
      src: "/products/piercing-reference-client.png",
      alt: "Perforación de oreja realizada con aros plateados",
    },
    captionEyebrow: "Servicio con reserva",
    captionTitle: "Inspiración para tu próximo estilo",
  },
  history: {
    kicker: "Nuestra historia",
    title: "Desde el 2003 formando parte de tus momentos.",
    description:
      "Gracias por elegirnos para celebrar aniversarios, logros, regalos y recuerdos que duran para siempre.",
    linkLabel: "Conocé Dela Rosa",
    image: {
      src: "/logo-delarosa-blanco.jpg",
      alt: "Logo de Dela Rosa",
    },
  },
  location: {
    kicker: "Nuestra casa",
    title: "Te esperamos en Encarnación.",
    description: STORE_ADDRESS,
    mapLabel: "Cómo llegar",
    whatsappLabel: "Consultar horario",
  },
};

function imageFromSanity(
  image: EditableImage | undefined,
  fallback: HomeImage,
  width: number,
  height?: number,
): HomeImage {
  if (!image) return fallback;

  let imageBuilder = builder.image(image).width(width);
  if (height) imageBuilder = imageBuilder.height(height).fit("crop");

  return {
    src: imageBuilder.auto("format").url(),
    alt: image.alt?.trim() || fallback.alt,
  };
}

export async function getHomePage(): Promise<HomePageContent> {
  try {
    const entry = await sanityClient.fetch<RawHomePage>(
      HOMEPAGE_QUERY,
      {},
      { next: { revalidate: 30, tags: ["homepage", "products"] } },
    );

    const hero = entry.hero;
    const categories = entry.categories;
    const piercing = entry.piercing;
    const history = entry.history;

    return {
      hero: {
        ...defaultHomePage.hero,
        ...hero,
        mainImage: imageFromSanity(
          hero?.mainImage,
          defaultHomePage.hero.mainImage,
          1200,
          1500,
        ),
        secondaryImage: imageFromSanity(
          hero?.secondaryImage,
          defaultHomePage.hero.secondaryImage,
          900,
          1100,
        ),
      },
      services: {
        items: entry.services?.items?.length
          ? entry.services.items
          : defaultHomePage.services.items,
      },
      categories: {
        ...defaultHomePage.categories,
        ...categories,
        cards: categories?.cards?.length
          ? categories.cards.map((card, index) => ({
              ...card,
              _key: card._key || `category-${index}`,
              image: imageFromSanity(
                card.image,
                defaultHomePage.categories.cards[
                  index % defaultHomePage.categories.cards.length
                ].image,
                900,
                1100,
              ),
            }))
          : defaultHomePage.categories.cards,
      },
      featured: {
        ...defaultHomePage.featured,
        ...entry.featured,
        productIds: entry.featured?.productIds?.filter(Boolean) ?? [],
      },
      piercing: {
        ...defaultHomePage.piercing,
        ...piercing,
        image: imageFromSanity(
          piercing?.image,
          defaultHomePage.piercing.image,
          1100,
          1300,
        ),
      },
      history: {
        ...defaultHomePage.history,
        ...history,
        image: imageFromSanity(
          history?.image,
          defaultHomePage.history.image,
          1300,
        ),
      },
      location: {
        ...defaultHomePage.location,
        ...entry.location,
      },
    };
  } catch {
    return defaultHomePage;
  }
}
