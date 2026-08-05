const projectId = "224225np";
const dataset = "production";
const apiVersion = "2026-08-03";
const allowedCategories = new Set([
  "Anillos",
  "Aros",
  "Argollas de plata",
  "Cadenas",
  "Pulseras",
  "Sets",
  "Relojes",
  "Reloj dama",
  "Reloj caballero",
  "Reloj infantil",
  "Dijes",
  "Bombillas",
  "Bolígrafos",
  "Combos",
  "Regalos",
]);

const query = `
  *[
    _type == "product" &&
    !(_id in path("drafts.**")) &&
    status != "hidden"
  ] | order(category asc, name asc) {
    _id,
    name,
    category,
    material,
    sourceKey,
    "hasImage": defined(image.asset),
    "imageRef": image.asset._ref
  }
`;
const url = new URL(
  `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
);
url.searchParams.set("query", query);

const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Sanity respondió ${response.status}.`);
}

const { result: products } = await response.json();
const issues = [];
const sourceKeys = new Set();
const imageRefs = new Map();

function expectedCategory(product) {
  const normalized = product.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (
    product.sourceKey?.startsWith("argolla-plata-") ||
    (normalized.startsWith("argolla") && product.material === "Plata 925")
  ) {
    return "Argollas de plata";
  }

  if (normalized.startsWith("reloj dama")) return "Reloj dama";
  if (normalized.startsWith("reloj caballero")) return "Reloj caballero";
  if (normalized.startsWith("reloj infantil")) return "Reloj infantil";
  if (normalized.startsWith("reloj ") || normalized.startsWith("set de relojes")) return "Relojes";
  if (normalized.startsWith("bombilla")) return "Bombillas";
  if (normalized.startsWith("boligrafo")) return "Bolígrafos";
  if (normalized.startsWith("pulsera")) return "Pulseras";
  if (normalized.startsWith("cadena") || normalized.startsWith("collar")) return "Cadenas";
  if (/^(set )?(anillos?|alianzas?|solitarios?)/.test(normalized)) return "Anillos";
  if (/^(set (de )?)?(aros?|argollas?|huggies|piercing)/.test(normalized)) return "Aros";
  if (normalized.startsWith("set ")) return "Sets";
  return null;
}

for (const product of products) {
  if (!allowedCategories.has(product.category)) {
    issues.push(`${product.name}: categoría desconocida "${product.category}".`);
  }

  const expected = expectedCategory(product);
  if (expected && product.category !== expected && product.category !== "Combos") {
    issues.push(`${product.name}: está en ${product.category}; se esperaba ${expected}.`);
  }

  if (!product.hasImage) {
    issues.push(`${product.name}: no tiene foto.`);
  }

  if (product.imageRef) {
    const previousImage = imageRefs.get(product.imageRef);

    if (previousImage && previousImage.category !== product.category) {
      issues.push(
        `${product.name}: comparte la misma foto con ${previousImage.name} de la categoría ${previousImage.category}.`,
      );
    } else if (!previousImage) {
      imageRefs.set(product.imageRef, product);
    }
  }

  if (!product.material || product.material === "1") {
    issues.push(`${product.name}: material inválido.`);
  }

  if (product.sourceKey) {
    if (sourceKeys.has(product.sourceKey)) {
      issues.push(`${product.name}: identificador duplicado ${product.sourceKey}.`);
    }
    sourceKeys.add(product.sourceKey);
  }
}

const counts = Object.entries(
  products.reduce((result, product) => {
    result[product.category] = (result[product.category] ?? 0) + 1;
    return result;
  }, {}),
).sort(([left], [right]) => left.localeCompare(right, "es"));

console.log(`Productos revisados: ${products.length}`);
for (const [category, count] of counts) {
  console.log(`- ${category}: ${count}`);
}

if (issues.length) {
  console.error("\nProblemas encontrados:");
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exitCode = 1;
} else {
  console.log("\nCatálogo correcto: fotos, categorías, materiales e identificadores validados.");
}
