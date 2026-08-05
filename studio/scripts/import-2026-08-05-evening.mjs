import { createReadStream, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

const client = process.env.SANITY_AUTH_TOKEN
  ? createClient({
      projectId: "224225np",
      dataset: "production",
      apiVersion: "2026-08-05",
      useCdn: false,
      token: process.env.SANITY_AUTH_TOKEN,
    })
  : getCliClient({ apiVersion: "2026-08-05" });

const projectRoot = resolve(import.meta.dirname, "../..");
const products = JSON.parse(
  readFileSync(
    resolve(projectRoot, "catalog", "client-products-2026-08-05-evening.json"),
    "utf8",
  ),
);

async function importProduct(product, index) {
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
    description: product.description,
    badge: "Nuevo",
    featured: false,
    order: 60 + index,
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

let cursor = 0;
async function worker() {
  while (cursor < products.length) {
    const index = cursor;
    cursor += 1;
    await importProduct(products[index], index);
  }
}

await Promise.all(Array.from({ length: 4 }, () => worker()));

const sourceKeys = products.map((product) => product.sourceKey);
const importedDocuments = await client.fetch(
  `*[_type == "product" && sourceKey in $sourceKeys]
    | order(sourceKey asc, _createdAt asc){_id, sourceKey}`,
  { sourceKeys },
);
const documentsBySourceKey = Map.groupBy(
  importedDocuments,
  (document) => document.sourceKey,
);

for (const [sourceKey, documents] of documentsBySourceKey) {
  for (const duplicate of documents.slice(1)) {
    await client
      .patch(duplicate._id)
      .set({
        status: "hidden",
        featured: false,
        sourceKey: `${sourceKey}-duplicate-hidden-${duplicate._id.slice(-6)}`,
      })
      .commit();
    console.log(`↳ Duplicado oculto: ${sourceKey}`);
  }
}

console.log(`Lote nocturno listo: ${products.length} productos.`);
