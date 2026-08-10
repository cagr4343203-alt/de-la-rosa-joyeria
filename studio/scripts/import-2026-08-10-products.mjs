import { createReadStream, existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-08-10" });
const applyChanges = process.argv.includes("--apply");
const projectRoot = resolve(import.meta.dirname, "../..");
const assetRoot = resolve(
  projectRoot,
  "public",
  "products",
  "client",
  "2026-08-10",
);
const products = JSON.parse(
  readFileSync(
    resolve(projectRoot, "catalog", "client-products-2026-08-10.json"),
    "utf8",
  ),
);

function assertUnique(field) {
  const seen = new Set();
  for (const product of products) {
    if (seen.has(product[field])) {
      throw new Error(`Valor repetido en ${field}: ${product[field]}`);
    }
    seen.add(product[field]);
  }
}

function defaultDescription(product) {
  if (product.category === "Dijes") {
    return `${product.name}. Diseño delicado en oro 18K para llevar un recuerdo especial. Consultá disponibilidad y precio por WhatsApp.`;
  }
  if (product.category === "Combos") {
    return `${product.name} con piezas coordinadas para lucir o regalar. Consultá disponibilidad, material exacto y precio por WhatsApp.`;
  }
  if (product.category === "Sets") {
    return `${product.name}, una selección de aros para combinar en distintas perforaciones. Consultá disponibilidad, material exacto y precio por WhatsApp.`;
  }
  return `${product.name}, un diseño seleccionado por Dela Rosa. Consultá disponibilidad, material exacto y precio por WhatsApp.`;
}

function validateFiles() {
  const missing = [];
  for (const product of products) {
    for (const file of [product.file, ...(product.gallery ?? [])]) {
      if (!existsSync(resolve(assetRoot, file))) missing.push(file);
    }
  }
  if (missing.length) {
    throw new Error(`Faltan ${missing.length} archivos:\n${missing.join("\n")}`);
  }
}

async function uploadImage(file) {
  const absolutePath = resolve(assetRoot, file);
  return client.assets.upload("image", createReadStream(absolutePath), {
    filename: basename(file),
  });
}

assertUnique("sourceKey");
assertUnique("name");
validateFiles();

const materialSlugs = [...new Set(products.map((product) => product.materialSlug))];
const [materials, existingProducts, nameCollisions, highestOrderedProduct] = await Promise.all([
  client.fetch(
    `*[_type == "productMaterial" && slug.current in $slugs && !(_id in path("drafts.**"))]{_id, name, "slug": slug.current}`,
    { slugs: materialSlugs },
  ),
  client.fetch(
    `*[_type == "product" && sourceKey in $sourceKeys && !(_id in path("drafts.**"))] | order(sourceKey asc, _createdAt asc){_id, sourceKey, image, gallery, description, order}`,
    { sourceKeys: products.map((product) => product.sourceKey) },
  ),
  client.fetch(
    `*[_type == "product" && name in $names && !(sourceKey in $sourceKeys) && !(_id in path("drafts.**"))]{_id, name, sourceKey}`,
    {
      names: products.map((product) => product.name),
      sourceKeys: products.map((product) => product.sourceKey),
    },
  ),
  client.fetch(`*[_type == "product"] | order(order desc)[0]{order}`),
]);

const materialBySlug = new Map(
  materials.map((material) => [material.slug, material]),
);
const missingMaterials = materialSlugs.filter(
  (slug) => !materialBySlug.has(slug),
);
if (missingMaterials.length) {
  throw new Error(`Faltan materiales en Sanity: ${missingMaterials.join(", ")}`);
}
if (nameCollisions.length) {
  throw new Error(
    `Ya existen productos con estos nombres: ${nameCollisions.map((item) => item.name).join(", ")}`,
  );
}

const existingBySourceKey = new Map();
for (const product of existingProducts) {
  if (!existingBySourceKey.has(product.sourceKey)) {
    existingBySourceKey.set(product.sourceKey, product);
  }
}
const imageCount = new Set(
  products.flatMap((product) => [product.file, ...(product.gallery ?? [])]),
).size;

console.log(applyChanges ? "MODO APLICAR" : "MODO DRY-RUN");
console.log(`Productos preparados: ${products.length}`);
console.log(`Imágenes preparadas: ${imageCount}`);
console.log(`Productos nuevos: ${products.length - existingBySourceKey.size}`);
console.log(`Productos existentes para actualizar: ${existingBySourceKey.size}`);
console.log(`Materiales usados: ${materials.map((item) => item.name).join(", ")}`);

if (!applyChanges) {
  console.log("Dry-run finalizado: no se subió ni modificó contenido.");
  process.exit(0);
}

let cursor = 0;
let createdCount = 0;
let updatedCount = 0;

async function importProduct(product, index) {
  const existing = existingBySourceKey.get(product.sourceKey);
  let primaryAssetRef = existing?.image?.asset?._ref;
  if (!primaryAssetRef) {
    primaryAssetRef = (await uploadImage(product.file))._id;
  }

  const existingGallery = existing?.gallery ?? [];
  const gallery = [];
  for (let galleryIndex = 0; galleryIndex < (product.gallery ?? []).length; galleryIndex += 1) {
    const file = product.gallery[galleryIndex];
    let assetRef = existingGallery[galleryIndex]?.asset?._ref;
    if (!assetRef) assetRef = (await uploadImage(file))._id;
    gallery.push({
      _key: `view-${galleryIndex + 2}`,
      _type: "image",
      asset: { _type: "reference", _ref: assetRef },
      alt: `${product.name}, vista ${galleryIndex + 2}`,
    });
  }

  const document = {
    _type: "product",
    name: product.name,
    slug: { _type: "slug", current: product.sourceKey },
    status: "available",
    category: product.category,
    materialRef: {
      _type: "reference",
      _ref: materialBySlug.get(product.materialSlug)._id,
    },
    price: 0,
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: primaryAssetRef },
      alt: product.name,
    },
    gallery,
    referentialImage: false,
    imageFit: "contain",
    description:
      product.description ?? existing?.description ?? defaultDescription(product),
    badge: "Nuevo",
    featured: false,
    order:
      existing?.order ?? Number(highestOrderedProduct?.order ?? 0) + index + 1,
    sourceKey: product.sourceKey,
  };

  if (existing?._id) {
    const fields = { ...document };
    delete fields._type;
    await client.patch(existing._id).set(fields).commit();
    updatedCount += 1;
  } else {
    await client.create(document);
    createdCount += 1;
  }
  console.log(`✓ ${product.name}`);
}

async function worker() {
  while (cursor < products.length) {
    const index = cursor;
    cursor += 1;
    await importProduct(products[index], index);
  }
}

await Promise.all(Array.from({ length: 4 }, () => worker()));

let verification = await client.fetch(
  `*[_type == "product" && sourceKey in $sourceKeys && !(_id in path("drafts.**"))]{
    _id,
    _createdAt,
    sourceKey,
    name,
    category,
    price,
    status,
    "material": materialRef->name,
    "imageRef": image.asset._ref,
    "galleryCount": count(gallery)
  }`,
  { sourceKeys: products.map((product) => product.sourceKey) },
);

const documentsBySourceKey = new Map();
for (const document of verification) {
  const group = documentsBySourceKey.get(document.sourceKey) ?? [];
  group.push(document);
  documentsBySourceKey.set(document.sourceKey, group);
}
const duplicates = [];
for (const documents of documentsBySourceKey.values()) {
  documents.sort((left, right) => left._createdAt.localeCompare(right._createdAt));
  duplicates.push(...documents.slice(1));
}

if (duplicates.length) {
  for (let index = 0; index < duplicates.length; index += 100) {
    let transaction = client.transaction();
    for (const duplicate of duplicates.slice(index, index + 100)) {
      transaction = transaction.delete(duplicate._id);
    }
    await transaction.commit();
  }
  console.log(`Copias accidentales eliminadas: ${duplicates.length}`);
  verification = await client.fetch(
    `*[_type == "product" && sourceKey in $sourceKeys && !(_id in path("drafts.**"))]{
      _id,
      sourceKey,
      name,
      category,
      price,
      status,
      "material": materialRef->name,
      "imageRef": image.asset._ref,
      "galleryCount": count(gallery)
    }`,
    { sourceKeys: products.map((product) => product.sourceKey) },
  );
}

const invalid = verification.filter(
  (product) =>
    !product.imageRef ||
    !product.material ||
    product.price !== 0 ||
    product.status !== "available",
);
if (verification.length !== products.length || invalid.length) {
  throw new Error(
    `Validación fallida: ${verification.length}/${products.length} documentos; ${invalid.length} inválidos.`,
  );
}

console.log(
  `Importación verificada: ${createdCount} creados, ${updatedCount} actualizados y ${verification.length} publicados.`,
);
