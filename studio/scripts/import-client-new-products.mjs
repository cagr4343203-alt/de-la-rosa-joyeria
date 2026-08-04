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
const products = JSON.parse(
  readFileSync(
    resolve(projectRoot, "catalog", "client-new-products.json"),
    "utf8",
  ),
);

for (let index = 0; index < products.length; index += 1) {
  const product = products[index];
  const existing = await client.fetch(
    `*[_type == "product" && sourceKey == $sourceKey][0]{_id, image}`,
    { sourceKey: product.sourceKey },
  );

  let assetRef = existing?.image?.asset?._ref;
  if (!assetRef) {
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

  const isRing = product.category === "Anillos";
  const document = {
    _type: "product",
    name: product.name,
    slug: { _type: "slug", current: product.sourceKey },
    status: "available",
    category: product.category,
    material: product.material,
    price: 0,
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: assetRef },
      alt: product.name,
    },
    imageFit: "contain",
    referentialImage: false,
    description: isRing
      ? "Anillo de compromiso de oro 18K. Consultá disponibilidad y detalles por WhatsApp."
      : "Argolla de plata 925. Consultá disponibilidad y detalles por WhatsApp.",
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
