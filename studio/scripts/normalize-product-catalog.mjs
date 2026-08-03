import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-08-03" });
const oldWatchUpdates = {
  "ga-20260731-054": {
    name: "Reloj dama bicolor clásico",
    category: "Reloj dama",
    material: "Acero bicolor",
  },
  "ga-20260731-055": {
    name: "Reloj dama bicolor rectangular",
    category: "Reloj dama",
    material: "Acero bicolor",
  },
  "ga-20260731-057": {
    name: "Reloj caballero dorado Lumière",
    category: "Reloj caballero",
    material: "Acero dorado",
  },
  "ga-20260731-058": {
    name: "Reloj caballero dorado Signature",
    category: "Reloj caballero",
    material: "Acero dorado",
  },
  "ga-20260731-059": {
    name: "Reloj dama rectangular bicolor",
    category: "Reloj dama",
    material: "Acero bicolor",
  },
  "ga-20260731-060": {
    name: "Reloj dama negro con cadena dorada",
    category: "Reloj dama",
    material: "Acero dorado",
  },
  "ga-20260731-061": {
    name: "Reloj dama dorado petite",
    category: "Reloj dama",
    material: "Acero dorado",
  },
  "ga-20260731-062": {
    name: "Reloj dama rectangular con malla",
    category: "Reloj dama",
    material: "Acero y malla metálica",
  },
  "ga-20260731-063": {
    name: "Reloj dama negro con destellos",
    category: "Reloj dama",
    material: "Acero",
  },
  "ga-20260731-094": {
    name: "Reloj caballero Casio cuero marrón",
    category: "Reloj caballero",
    material: "Acero y cuero",
  },
  "ga-20260731-096": {
    name: "Reloj caballero Casio negro urbano",
    category: "Reloj caballero",
    material: "Acero y cuero",
  },
  "ga-20260731-097": {
    name: "Reloj caballero Casio dark brown",
    category: "Reloj caballero",
    material: "Acero y cuero",
  },
  "ga-20260731-098": {
    name: "Reloj caballero Casio blanco clásico",
    category: "Reloj caballero",
    material: "Acero y cuero",
  },
};
const products = await client.fetch(`
  *[_type == "product"] {
    _id,
    name,
    category,
    material,
    sourceKey,
    imageFit
  }
`);

let updated = 0;

for (const product of products) {
  const fields = {};
  const oldWatchUpdate = oldWatchUpdates[product.sourceKey];

  if (oldWatchUpdate) {
    Object.assign(fields, oldWatchUpdate);
  }

  if (!product.imageFit) {
    fields.imageFit = "contain";
  }

  if (product.material === "1" && !oldWatchUpdate) {
    fields.material = "Material a confirmar";
  }

  if (Object.keys(fields).length > 0) {
    await client.patch(product._id).set(fields).commit();
    updated += 1;
  }
}

console.log(`Catálogo normalizado: ${updated} de ${products.length} productos actualizados.`);
