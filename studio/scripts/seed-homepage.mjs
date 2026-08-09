import { createReadStream } from "node:fs";
import { basename, resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-29" });
const projectRoot = resolve(import.meta.dirname, "../..");

async function uploadImage(relativePath, alt) {
  const filename = basename(relativePath);
  const existingAssetId = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
    { filename },
  );

  let assetId = existingAssetId;
  if (!assetId) {
    const asset = await client.assets.upload(
      "image",
      createReadStream(resolve(projectRoot, "public", relativePath)),
      { filename },
    );
    assetId = asset._id;
  }

  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    alt,
  };
}

const [
  heroMainImage,
  heroSecondaryImage,
  earringsImage,
  strawImage,
  braceletImage,
  piercingImage,
  historyImage,
] = await Promise.all([
  uploadImage("products/06-joya.jpg", "Anillos de Dela Rosa"),
  uploadImage("products/05-pulsera.jpg", "Pulsera de Dela Rosa"),
  uploadImage("products/04-aros.jpg", "Aros de Dela Rosa"),
  uploadImage("products/gifts/bombilla-04.jpg", "Bombilla de Dela Rosa"),
  uploadImage(
    "products/client/pulsera-tennis-gold.jpeg",
    "Pulsera de Dela Rosa",
  ),
  uploadImage(
    "products/piercing-reference-client.png",
    "Perforación de oreja realizada con aros plateados",
  ),
  uploadImage("logo-delarosa-blanco.jpg", "Logo de Dela Rosa"),
]);

const featuredProductIds = await client.fetch(
  `*[
    _type == "product" &&
    category != "Combos" &&
    status != "hidden"
  ] | order(featured desc, order asc, name asc)[0...4]._id`,
);

const documents = [
  {
    _id: "homeHero",
    _type: "homeHero",
    kicker: "Dela Rosa Joyería · Encarnación · Desde 2003",
    title: "El detalle exclusivo",
    emphasis: "para ese momento especial.",
    description:
      "Joyas, relojes y regalos seleccionados para acompañar historias que merecen ser recordadas.",
    primaryActionLabel: "Ver productos",
    secondaryActionLabel: "Reservar perforación",
    trustFirst: "Oro, plata y relojería",
    trustSecond: "Atención personalizada",
    mainImage: heroMainImage,
    secondaryImage: heroSecondaryImage,
    reserveEyebrow: "Agenda disponible",
    reserveTitle: "Reservá tu perforación",
  },
  {
    _id: "homeServices",
    _type: "homeServices",
    items: [
      {
        _key: "jewelry",
        _type: "homeServiceItem",
        icon: "gem",
        title: "Joyas seleccionadas",
        description: "Oro 18K, plata y enchapados",
      },
      {
        _key: "watches",
        _type: "homeServiceItem",
        icon: "watch",
        title: "Relojes",
        description: "Modelos clásicos y contemporáneos",
      },
      {
        _key: "gifts",
        _type: "homeServiceItem",
        icon: "gift",
        title: "Regalos especiales",
        description: "Bombillas, bolígrafos y más detalles",
      },
      {
        _key: "piercing",
        _type: "homeServiceItem",
        icon: "calendar",
        title: "Perforación de oreja",
        description: "Reservá fecha y horario por WhatsApp",
      },
    ],
  },
  {
    _id: "homeCategories",
    _type: "homeCategories",
    kicker: "Comprar por categoría",
    title: "Encontrá ese detalle especial",
    linkLabel: "Ver todo el catálogo",
    cards: [
      {
        _key: "rings",
        _type: "homeCategoryCard",
        category: "Anillos",
        title: "Anillos",
        eyebrow: "Momentos únicos",
        image: heroMainImage,
      },
      {
        _key: "earrings",
        _type: "homeCategoryCard",
        category: "Aros",
        title: "Aros",
        eyebrow: "Brillo cotidiano",
        image: earringsImage,
      },
      {
        _key: "straws",
        _type: "homeCategoryCard",
        category: "Bombillas",
        title: "Bombillas",
        eyebrow: "Detalles para regalar",
        image: strawImage,
      },
      {
        _key: "bracelets",
        _type: "homeCategoryCard",
        category: "Pulseras",
        title: "Pulseras",
        eyebrow: "Plata 925 bañada en oro",
        image: braceletImage,
      },
    ],
  },
  {
    _id: "homeFeatured",
    _type: "homeFeatured",
    kicker: "Selección Dela Rosa",
    title: "Productos destacados",
    description:
      "Agregá tus favoritos al carrito o consultá la disponibilidad directamente por WhatsApp.",
    products: featuredProductIds.map((id, index) => ({
      _key: `featured-${index + 1}`,
      _type: "reference",
      _ref: id,
    })),
  },
  {
    _id: "homePiercing",
    _type: "homePiercing",
    kicker: "Reserva de perforación",
    title: "Tu nuevo brillo, con atención personalizada.",
    description:
      "Elegí fecha, horario y cantidad de perforaciones. Preparamos tu solicitud y la confirmamos contigo por WhatsApp.",
    firstPoint: "Reserva rápida",
    secondPoint: "Cuidado y orientación",
    buttonLabel: "Reservar ahora",
    image: piercingImage,
    captionEyebrow: "Servicio con reserva",
    captionTitle: "Inspiración para tu próximo estilo",
  },
  {
    _id: "homeHistory",
    _type: "homeHistory",
    image: historyImage,
    kicker: "Nuestra historia",
    title: "Desde el 2003 formando parte de tus momentos.",
    description:
      "Gracias por elegirnos para celebrar aniversarios, logros, regalos y recuerdos que duran para siempre.",
    linkLabel: "Conocé Dela Rosa",
  },
  {
    _id: "homeLocation",
    _type: "homeLocation",
    kicker: "Nuestra casa",
    title: "Te esperamos en Encarnación.",
    description:
      "Mariscal José Félix Estigarribia, Encarnación, Paraguay",
    mapLabel: "Cómo llegar",
    whatsappLabel: "Consultar horario",
  },
];

for (const document of documents) {
  const existing = await client.getDocument(document._id);
  if (existing) {
    console.log(`— ${document._id} ya existe; se conserva sin cambios.`);
    continue;
  }

  await client.createIfNotExists(document);
  console.log(`✓ ${document._id} creado.`);
}

console.log("Página de inicio lista para editar desde Sanity.");
