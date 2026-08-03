import { createReadStream, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-08-03" });
const projectRoot = resolve(import.meta.dirname, "../..");
const giftCatalog = JSON.parse(
  readFileSync(resolve(projectRoot, "catalog", "gift-products.json"), "utf8"),
);

for (let index = 0; index < giftCatalog.length; index += 1) {
  const gift = giftCatalog[index];
  const existing = await client.fetch(
    `*[_type == "product" && sourceKey == $sourceKey][0]{_id, image}`,
    { sourceKey: gift.sourceKey },
  );

  const filepath = resolve(
    projectRoot,
    "public",
    "products",
    "gifts",
    gift.file,
  );
  let assetRef = existing?.image?.asset?._ref;

  if (!assetRef) {
    const asset = await client.assets.upload("image", createReadStream(filepath), {
      filename: gift.file,
    });
    assetRef = asset._id;
  }

  const document = {
    _type: "product",
    name: gift.name,
    slug: { _type: "slug", current: gift.sourceKey },
    status: "available",
    category: gift.category,
    material: gift.material,
    price: 0,
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: assetRef },
      alt: gift.name,
    },
    imageFit: "contain",
    referentialImage: false,
    description:
      "Foto real de Dela Rosa. Consultá disponibilidad y precio por WhatsApp.",
    badge: "Nuevo",
    featured: index < 2,
    order: 300 + index,
    sourceKey: gift.sourceKey,
  };

  if (existing?._id) {
    const { _type, ...fields } = document;
    await client.patch(existing._id).set(fields).commit();
  } else {
    await client.create(document);
  }

  console.log(`✓ ${gift.name}`);
}

console.log(`Regalos listos: ${giftCatalog.length} productos.`);
