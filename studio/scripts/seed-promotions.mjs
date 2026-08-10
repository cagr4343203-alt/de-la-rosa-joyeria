import { createReadStream, existsSync } from "node:fs";
import { basename } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-08-09" });

const continentalPath = process.env.PROMO_CONTINENTAL_PATH;
const itauPath = process.env.PROMO_ITAU_PATH;

if (!continentalPath || !itauPath) {
  throw new Error(
    "Definí PROMO_CONTINENTAL_PATH y PROMO_ITAU_PATH antes de ejecutar el script.",
  );
}

for (const filePath of [continentalPath, itauPath]) {
  if (!existsSync(filePath)) {
    throw new Error(`No se encontró la imagen: ${filePath}`);
  }
}

async function uploadOrReuse(filePath) {
  const filename = basename(filePath);
  const existingId = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
    { filename },
  );

  if (existingId) return existingId;

  const asset = await client.assets.upload("image", createReadStream(filePath), {
    filename,
  });

  return asset._id;
}

const [continentalAsset, itauAsset] = await Promise.all([
  uploadOrReuse(continentalPath),
  uploadOrReuse(itauPath),
]);

const documents = [
  {
    _id: "promotion-continental-12-cuotas",
    _type: "promotion",
    title: "12 cuotas sin intereses con Continental",
    badge: "Todos los días · 12 cuotas",
    description:
      "Comprá tus piezas favoritas con tarjetas de crédito Continental y pagá en hasta 12 cuotas sin intereses.",
    terms: "Beneficio sujeto a vigencia y condiciones de Continental.",
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: continentalAsset },
      alt: "Promoción de 12 cuotas sin intereses con Continental",
    },
    imageRotation: 0,
    active: true,
    order: 10,
  },
  {
    _id: "promotion-itau-beneficios",
    _type: "promotion",
    title: "Beneficios con tarjetas Itaú",
    badge: "10% de reintegro · Hasta 10 cuotas",
    description:
      "Los lunes y martes aprovechá 10% de reintegro y consultá por compras en hasta 10 cuotas sin intereses con Itaú.",
    terms: "Beneficios sujetos a vigencia, tarjetas participantes y condiciones de Itaú.",
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: itauAsset },
      alt: "Promoción de reintegro y cuotas sin intereses con Itaú",
    },
    imageRotation: 0,
    active: true,
    order: 20,
  },
];

const transaction = documents.reduce(
  (current, document) => current.createOrReplace(document),
  client.transaction(),
);

await transaction.commit();

console.log(`Promociones cargadas: ${documents.length}`);
