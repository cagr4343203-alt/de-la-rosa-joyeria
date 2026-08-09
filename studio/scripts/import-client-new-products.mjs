import { createReadStream, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

const client = process.env.SANITY_AUTH_TOKEN
  ? createClient({
      projectId: "224225np",
      dataset: "production",
      apiVersion: "2026-08-04",
      useCdn: false,
      token: process.env.SANITY_AUTH_TOKEN,
    })
  : getCliClient({ apiVersion: "2026-08-04" });
const projectRoot = resolve(import.meta.dirname, "../..");
const catalogFiles = [
  "client-new-products.json",
  "client-products-august.json",
  "client-products-2026-08-05.json",
  "client-products-2026-08-05-evening.json",
];
const products = catalogFiles.flatMap((filename) =>
  JSON.parse(
    readFileSync(resolve(projectRoot, "catalog", filename), "utf8"),
  ),
);

function productDescription(product) {
  if (product.description) {
    return product.description;
  }

  if (product.category === "Anillos") {
    return "Anillo de compromiso de oro 18K. Consultá disponibilidad y detalles por WhatsApp.";
  }

  if (product.category === "Reloj infantil") {
    return "Reloj infantil. Consultá disponibilidad, características y precio por WhatsApp.";
  }

  if (product.sourceKey.startsWith("argolla-plata-")) {
    return "Argolla de plata 925. Consultá disponibilidad y detalles por WhatsApp.";
  }

  return "Aros de plata 925. Consultá disponibilidad y detalles por WhatsApp.";
}

function productCategory(category) {
  return category === "Argollas de plata" ? "Aros" : category;
}

for (let index = 0; index < products.length; index += 1) {
  const product = products[index];
  const existing = await client.fetch(
    `*[_type == "product" && sourceKey == $sourceKey][0]{_id, image}`,
    { sourceKey: product.sourceKey },
  );

  let assetRef = existing?.image?.asset?._ref;
  if (!assetRef || product.forceImage) {
    const filepath = resolve(
      projectRoot,
      "public",
      "products",
      "client",
      product.file,
    );
    const asset = await client.assets.upload("image", createReadStream(filepath), {
      filename: product.file.split("/").at(-1),
    });
    assetRef = asset._id;
  }

  const document = {
    _type: "product",
    name: product.name,
    slug: { _type: "slug", current: product.sourceKey },
    status: "available",
    category: productCategory(product.category),
    material: product.material,
    price: 0,
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: assetRef },
      alt: product.name,
    },
    imageFit: "contain",
    referentialImage: false,
    description: productDescription(product),
    badge: "Nuevo",
    featured: index < 4,
    order: 50 + index,
    sourceKey: product.sourceKey,
  };

  if (existing?._id) {
    const fields = { ...document };
    delete fields._type;
    await client.patch(existing._id).set(fields).commit();
  } else {
    await client.create(document);
  }

  console.log(`✓ ${product.name}`);
}

console.log(`Colección nueva lista: ${products.length} productos.`);
