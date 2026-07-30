import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-29" });
const projectRoot = resolve(import.meta.dirname, "../..");

const bracelets = [
  ["pulsera-tennis-gold", "Pulsera Tennis Gold", "pulsera-tennis-gold.jpeg", "Línea continua de cristales con terminación delicada y cadena regulable."],
  ["pulsera-mariposa-colgante", "Pulsera Mariposa Lumière", "pulsera-mariposa-colgante.jpeg", "Mariposas luminosas y un dije colgante para un detalle femenino y especial."],
  ["pulsera-estrellas", "Pulsera Estrellas Doradas", "pulsera-estrellas.jpeg", "Estrellas doradas distribuidas sobre una cadena fina de ajuste regulable."],
  ["pulsera-flores-brillantes", "Pulsera Flores Brillantes", "pulsera-flores-brillantes.jpeg", "Flores con destellos sobre una estructura dorada ligera y elegante."],
  ["pulsera-torre-eiffel", "Pulsera Paris", "pulsera-torre-eiffel.jpeg", "Diseño inspirado en París con perlas luminosas y una delicada Torre Eiffel."],
  ["pulsera-corazon-pave", "Pulsera Corazón Pavé", "pulsera-corazon-pave.jpeg", "Corazón central con brillo pavé sobre una cadena fina y regulable."],
  ["pulsera-nuit-azul", "Pulsera Nuit Azul", "pulsera-nuit-azul.jpeg", "Contraste azul profundo con eslabones dorados para un estilo contemporáneo."],
  ["pulsera-circulo-lumiere", "Pulsera Círculo Lumière", "pulsera-circulo-lumiere.jpeg", "Círculo central luminoso y pequeños destellos sobre una cadena delicada."],
  ["pulsera-gota-lumiere", "Pulsera Gota Lumière", "pulsera-gota-lumiere.jpeg", "Dije central en forma de gota acompañado por sutiles puntos de luz."],
  ["pulsera-trebol-noir", "Pulsera Trébol Noir", "pulsera-trebol-noir.jpeg", "Trébol oscuro enmarcado en dorado con cadena doble de textura refinada."],
  ["pulsera-estrella-destellos", "Pulsera Estrella de Destellos", "pulsera-estrella-destellos.jpeg", "Estrella central y cristales geométricos para un brillo moderno."],
  ["pulsera-geometrica-rose", "Pulsera Geométrica Rosé", "pulsera-geometrica-rose.jpeg", "Formas geométricas en tonos suaves sobre una cadena dorada regulable."],
  ["pulsera-trebol-rouge", "Pulsera Trébol Rouge", "pulsera-trebol-rouge.jpeg", "Trébol rojo protagonista, enmarcado por delicados detalles dorados."],
];

for (let index = 0; index < bracelets.length; index += 1) {
  const [sourceKey, name, filename, description] = bracelets[index];
  const existing = await client.fetch(
    `*[_type == "product" && sourceKey == $sourceKey][0]{_id, image}`,
    { sourceKey },
  );

  let assetRef = existing?.image?.asset?._ref;
  if (!assetRef) {
    const filepath = resolve(
      projectRoot,
      "public",
      "products",
      "client",
      filename,
    );
    const asset = await client.assets.upload("image", createReadStream(filepath), {
      filename,
    });
    assetRef = asset._id;
  }

  const document = {
    _type: "product",
    name,
    slug: { _type: "slug", current: sourceKey },
    status: "available",
    category: "Pulseras",
    material: "Plata 925 bañada en oro",
    price: 0,
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: assetRef },
      alt: `${name} de plata 925 bañada en oro`,
    },
    referentialImage: false,
    description,
    badge: index === 0 ? "Nuevo" : "Colección nueva",
    featured: false,
    order: 130 + index,
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

console.log(`Colección lista: ${bracelets.length} pulseras publicadas.`);
