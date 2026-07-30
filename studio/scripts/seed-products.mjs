import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-29" });
const projectRoot = resolve(import.meta.dirname, "../..");

const products = [
  ["cadena-espiritu-santo", "Cadena Espíritu Santo", "Cadenas", "Oro 18K", 1350000, "01-cadena-angel.jpg", "Nueva", "Cadena delicada con dije simbólico y terminación luminosa.", true],
  ["argollas-trenzadas", "Argollas Trenzadas", "Aros", "Oro 18K", 980000, "03-anillos.jpg", "Favorita", "Argollas livianas con detalle trenzado para todos los días.", true],
  ["solitario-lumiere", "Solitario Lumière", "Anillos", "Plata Gold", 425000, "06-joya.jpg", "Destacado", "Anillo de brillo central, clásico y delicado.", true],
  ["pulsera-coeurs", "Pulsera Cœurs", "Pulseras", "Plata 925", 350000, "05-pulsera.jpg", "", "Corazones engastados y destellos que acompañan cada gesto.", false],
  ["collar-eclat", "Collar Éclat", "Cadenas", "Enchapado", 380000, "07-destello.jpg", "Edición especial", "Collar protagonista de discos dorados con textura satinada.", false],
  ["collar-mariposa", "Collar Mariposa", "Cadenas", "Plata Gold", 295000, "08-coleccion.jpg", "", "Mariposa de nácar con cadena regulable y doble detalle.", false],
  ["huggies-clasicos", "Huggies Clásicos", "Aros", "Oro 18K", 720000, "04-aros.jpg", "", "Aros compactos, cómodos y versátiles para combinar.", false],
  ["set-serena", "Set Serena", "Sets", "Plata 925", 470000, "09-plata.jpg", "Para regalar", "Un set armónico pensado para regalar o regalarte.", false],
  ["reloj-signature", "Cadena Jade Delicada", "Cadenas", "Enchapado", 0, "10-reloj.jpg", "Nuevo", "Cadena fina con delicados detalles verdes y terminación dorada.", false],
  ["dije-destello", "Collar Cuarzo Rosé", "Cadenas", "Enchapado", 0, "11-oro.jpg", "Nuevo", "Collar delicado con piedras en tonos rosados y diseño ligero.", false],
  ["bombilla-signature", "Bombilla Signature", "Bombillas", "Acero inoxidable", 145000, "12-regalos-bombilla-boligrafo.png", "Nuevo", "Bombilla de acero con terminación pulida para un regalo especial.", true, "left"],
  ["boligrafo-ejecutivo", "Bolígrafo Ejecutivo", "Bolígrafos", "Laca y metal", 185000, "12-regalos-bombilla-boligrafo.png", "Nuevo", "Bolígrafo elegante en negro y dorado, ideal para obsequiar.", true, "right"],
  ["combo-regalo-signature", "Combo Regalo Signature", "Combos", "Acero, laca y metal", 0, "12-regalos-bombilla-boligrafo.png", "Combo", "Combo de bombilla y bolígrafo pensado para un regalo especial.", false, "full"],
];

for (let index = 0; index < products.length; index += 1) {
  const [
    sourceKey,
    name,
    category,
    material,
    price,
    filename,
    badge,
    description,
    featured,
    cropSide,
  ] = products[index];

  const existing = await client.fetch(
    `*[_type == "product" && sourceKey == $sourceKey][0]{_id, image}`,
    { sourceKey },
  );

  let assetRef = existing?.image?.asset?._ref;
  if (!assetRef) {
    const filepath = resolve(projectRoot, "public", "products", filename);
    const asset = await client.assets.upload("image", createReadStream(filepath), {
      filename,
    });
    assetRef = asset._id;
  }

  const crop =
    cropSide === "left"
      ? { _type: "sanity.imageCrop", top: 0, bottom: 0, left: 0, right: 0.5 }
      : cropSide === "right"
        ? { _type: "sanity.imageCrop", top: 0, bottom: 0, left: 0.5, right: 0 }
        : undefined;

  const document = {
    _type: "product",
    name,
    slug: { _type: "slug", current: sourceKey },
    status: "available",
    category,
    material,
    price,
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: assetRef },
      alt: name,
      ...(crop ? { crop } : {}),
    },
    referentialImage: Boolean(cropSide),
    description,
    ...(badge ? { badge } : {}),
    featured,
    order: (index + 1) * 10,
    sourceKey,
  };

  if (existing?._id) {
    const { _type, ...fields } = document;
    await client.patch(existing._id).set(fields).commit();
  } else {
    await client.create(document);
  }

  console.log(`✓ ${name}`);
}

console.log(`Catálogo listo: ${products.length} productos publicados.`);
