import { createReadStream, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-08-03" });
const projectRoot = resolve(import.meta.dirname, "../..");
const watchCatalog = JSON.parse(
  readFileSync(resolve(projectRoot, "catalog", "watch-products.json"), "utf8"),
);

for (let index = 0; index < watchCatalog.length; index += 1) {
  const watch = watchCatalog[index];
  const sourceKey = `whatsapp-${watch.file.replace(/\.[^.]+$/, "")}`;
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
      "watches",
      watch.file,
    );
    const asset = await client.assets.upload("image", createReadStream(filepath), {
      filename: watch.file,
    });
    assetRef = asset._id;
  }

  const document = {
    _type: "product",
    name: watch.name,
    slug: { _type: "slug", current: sourceKey },
    status: "available",
    category: watch.category,
    material: watch.material,
    price: 0,
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: assetRef },
      alt: watch.name,
    },
    imageFit: "contain",
    referentialImage: false,
    description:
      "Foto real de Dela Rosa. Consultá disponibilidad y precio por WhatsApp.",
    badge: "Nuevo",
    featured: index < 6,
    order: 200 + index,
    sourceKey,
  };

  if (existing?._id) {
    const { _type, ...fields } = document;
    await client.patch(existing._id).set(fields).commit();
  } else {
    await client.create(document);
  }

  console.log(`✓ ${watch.name}`);
}

console.log(`Catálogo de relojes listo: ${watchCatalog.length} productos.`);
