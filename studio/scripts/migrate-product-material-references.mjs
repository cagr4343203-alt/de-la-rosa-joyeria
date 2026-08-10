import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-08-09" });
const applyChanges = process.argv.includes("--apply");

/**
 * Snapshot intencional de la taxonomía inicial.
 * Los documentos se buscan por slug y, si faltan, Sanity genera sus `_id`.
 * Nunca se construyen IDs a partir del slug ni del producto.
 */
const materialDefinitions = [
  {
    name: "Oro 18K",
    slug: "oro-18k",
    family: "oro",
    order: 10,
    aliases: ["Oro 18K"],
  },
  {
    name: "Enchapado dorado",
    slug: "enchapado-dorado",
    family: "enchapados",
    order: 20,
    aliases: ["Oro / Enchapado", "Enchapado dorado"],
  },
  {
    name: "Plata 925",
    slug: "plata-925",
    family: "plata",
    order: 30,
    aliases: ["Plata 925"],
  },
  {
    name: "Plata 925 bañada en oro",
    slug: "plata-925-banada-en-oro",
    family: "plata",
    order: 40,
    aliases: ["Plata 925 bañada en oro"],
  },
  {
    name: "Plata Gold",
    slug: "plata-gold",
    family: "plata",
    order: 50,
    aliases: ["Plata Gold"],
  },
  {
    name: "Plata",
    slug: "plata",
    family: "plata",
    order: 60,
    aliases: ["Plata"],
  },
  {
    name: "Plata bañada en oro rosa",
    slug: "plata-banada-en-oro-rosa",
    family: "plata",
    order: 70,
    aliases: ["plata bañados en oro rosa", "Plata bañada en oro rosa"],
  },
  {
    name: "Acero",
    slug: "acero",
    family: "acero",
    order: 100,
    aliases: ["Acero"],
  },
  {
    name: "Acero bicolor",
    slug: "acero-bicolor",
    family: "acero",
    order: 110,
    aliases: ["Acero bicolor"],
  },
  {
    name: "Acero dorado",
    slug: "acero-dorado",
    family: "acero",
    order: 120,
    aliases: ["Acero dorado"],
  },
  {
    name: "Acero rosé",
    slug: "acero-rose",
    family: "acero",
    order: 130,
    aliases: ["Acero rosé"],
  },
  {
    name: "Acero y cuero",
    slug: "acero-y-cuero",
    family: "acero",
    order: 140,
    aliases: ["Acero y cuero"],
  },
  {
    name: "Acero y malla metálica",
    slug: "acero-y-malla-metalica",
    family: "acero",
    order: 150,
    aliases: ["Acero y malla metálica"],
  },
  {
    name: "Acero y silicona",
    slug: "acero-y-silicona",
    family: "acero",
    order: 160,
    aliases: ["Acero y silicona"],
  },
  {
    name: "Enchapado",
    slug: "enchapado",
    family: "enchapados",
    order: 200,
    aliases: ["Enchapado"],
  },
  {
    name: "Metal dorado",
    slug: "metal-dorado",
    family: "enchapados",
    order: 210,
    aliases: ["Metal dorado"],
  },
  {
    name: "Silicona",
    slug: "silicona",
    family: "relojeria",
    order: 250,
    aliases: ["Silicona"],
  },
  {
    name: "Silicona y metal",
    slug: "silicona-y-metal",
    family: "relojeria",
    order: 260,
    aliases: ["Silicona y metal"],
  },
  {
    name: "Varios materiales",
    slug: "varios-materiales",
    family: "otros",
    order: 300,
    aliases: ["Varios"],
  },
  {
    name: "Material a confirmar",
    slug: "material-a-confirmar",
    family: "por-confirmar",
    order: 900,
    aliases: ["Material a confirmar"],
  },
];

const productMaterialOverrides = new Map([
  ["delarosa-ga-067", "plata-925"],
  ["delarosa-ga-018", "plata-925"],
]);

function normalizeMaterial(value) {
  return value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es-PY");
}

const definitionByLegacyValue = new Map(
  materialDefinitions.flatMap((definition) =>
    definition.aliases.map((alias) => [normalizeMaterial(alias), definition]),
  ),
);

const [existingMaterials, products] = await Promise.all([
  client.fetch(`
    *[_type == "productMaterial" && !(_id in path("drafts.**"))] {
      _id,
      name,
      "slug": slug.current
    }
  `),
  client.fetch(`
    *[_type == "product"] {
      _id,
      name,
      material,
      materialRef,
      "materialRefSlug": materialRef->slug.current
    }
  `),
]);

const existingBySlug = new Map(
  existingMaterials
    .filter((material) => material.slug)
    .map((material) => [material.slug, material]),
);

const linkableProducts = [];
const unresolvedValues = new Map();

for (const product of products) {
  const canonicalProductId = product._id.replace(/^drafts\./, "");
  const overrideSlug = productMaterialOverrides.get(canonicalProductId);
  const normalizedValue = normalizeMaterial(product.material);
  const definition = overrideSlug
    ? materialDefinitions.find((item) => item.slug === overrideSlug)
    : definitionByLegacyValue.get(normalizedValue);

  if (definition) {
    if (product.materialRefSlug !== definition.slug) {
      linkableProducts.push({ product, definition });
    }
    continue;
  }

  if (product.materialRef?._ref) continue;

  const label = product.material?.trim() || "Sin material";
  unresolvedValues.set(label, (unresolvedValues.get(label) ?? 0) + 1);
}

const missingMaterials = materialDefinitions.filter(
  (definition) => !existingBySlug.has(definition.slug),
);

console.log(applyChanges ? "MODO APLICAR" : "MODO DRY-RUN");
console.log(`Materiales que se crearían: ${missingMaterials.length}`);
console.log(`Productos que se vincularían: ${linkableProducts.length}`);
const unresolvedProductCount = [...unresolvedValues.values()].reduce(
  (total, count) => total + count,
  0,
);
console.log(
  `Productos ya vinculados correctamente: ${products.length - linkableProducts.length - unresolvedProductCount}`,
);
console.log(`Productos sin material reconocible: ${unresolvedProductCount}`);

if (missingMaterials.length) {
  console.log(
    `Nuevos materiales: ${missingMaterials.map((item) => item.name).join(", ")}`,
  );
}

if (unresolvedValues.size) {
  console.log("Valores que no se migran automáticamente:");
  for (const [value, count] of [...unresolvedValues].sort((a, b) =>
    a[0].localeCompare(b[0], "es"),
  )) {
    console.log(`- ${value}: ${count}`);
  }
}

if (!applyChanges) {
  console.log("Dry-run finalizado: no se escribió ningún documento.");
  process.exit(0);
}

const materialIdBySlug = new Map(
  existingMaterials
    .filter((material) => material.slug)
    .map((material) => [material.slug, material._id]),
);

for (const definition of missingMaterials) {
  const created = await client.create({
    _type: "productMaterial",
    name: definition.name,
    slug: { _type: "slug", current: definition.slug },
    family: definition.family,
    order: definition.order,
    active: true,
  });
  materialIdBySlug.set(definition.slug, created._id);
}

for (let index = 0; index < linkableProducts.length; index += 100) {
  const batch = linkableProducts.slice(index, index + 100);
  let transaction = client.transaction();

  for (const { product, definition } of batch) {
    const materialId = materialIdBySlug.get(definition.slug);
    if (!materialId) {
      throw new Error(`No se encontró el material ${definition.name}.`);
    }

    transaction = transaction.patch(product._id, (patch) =>
      patch.set({
        materialRef: { _type: "reference", _ref: materialId },
      }),
    );
  }

  await transaction.commit();
}

console.log(
  `Migración aplicada: ${missingMaterials.length} materiales creados y ${linkableProducts.length} productos vinculados.`,
);
console.log("El campo anterior material se conservó sin modificaciones.");
