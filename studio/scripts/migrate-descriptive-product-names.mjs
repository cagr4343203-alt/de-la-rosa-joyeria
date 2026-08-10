import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-08-09" });
const shouldApply = process.env.DELA_ROSA_APPLY_PRODUCT_NAMES === "1";

const productNames = [
  ["o2sn7RbciJBxTIZkZydqH3", "Anillo solitario clásico de oro 18K"],
  ["o2sn7RbciJBxTIZkZydqRV", "Anillo solitario cruzado de oro 18K"],
  ["o2sn7RbciJBxTIZkZydqmP", "Anillo solitario de oro 18K con engaste elevado"],
  ["dHIt4AvkoimGdzNqYo4uq3", "Anillo solitario de oro 18K con detalle lateral"],
  ["o2sn7RbciJBxTIZkZydrUp", "Anillo de oro 18K con circonias en abanico"],
  ["J83YxrOiC95hgF4anfdNoX", "Anillo de oro 18K con detalle entrelazado"],
  ["J83YxrOiC95hgF4anfdNyX", "Anillo de oro 18K con tres circonias en línea"],
  ["o2sn7RbciJBxTIZkZyds5P", "Anillo solitario de oro 18K con engaste de cuatro garras"],
  ["o2sn7RbciJBxTIZkZydsY9", "Anillo de oro 18K con detalle entrelazado y circonias"],
  ["J83YxrOiC95hgF4anfdOLX", "Anillo solitario de oro 18K con engaste tipo corona"],
  ["J83YxrOiC95hgF4anfdObX", "Anillo de oro 18K con cinco circonias"],
  ["dHIt4AvkoimGdzNqYo50YH", "Argollas anchas de plata 925 con detalle geométrico"],
  ["o2sn7RbciJBxTIZkZyduhP", "Argollas de plata 925 con dije abanico multicolor"],
  ["o2sn7RbciJBxTIZkZydv7X", "Argollas clásicas lisas de plata 925"],
  ["J83YxrOiC95hgF4anfdPOX", "Argollas pequeñas de plata 925 con corazón"],
  ["J83YxrOiC95hgF4anfdPYX", "Argollas lisas medianas de plata 925"],
  ["J83YxrOiC95hgF4anfdPpX", "Argollas de plata 925 con frente pavé"],
  ["J83YxrOiC95hgF4anfdQ5X", "Argollas de plata 925 con circonias laterales"],
  ["dHIt4AvkoimGdzNqYo53EB", "Argollas octogonales de plata 925"],
  ["J83YxrOiC95hgF4anfdQPX", "Argollas en V de plata 925 con circonias"],
  ["J83YxrOiC95hgF4anfdQXX", "Argollas de plata 925 con diseño floral calado"],
  ["J83YxrOiC95hgF4anfdruX", "Argollas anchas de plata 925 con diseño geométrico calado"],
  ["dHIt4AvkoimGdzNqYo6vWF", "Aros pequeños de plata 925 con piedra negra"],
  ["o2sn7RbciJBxTIZkZyew7p", "Aros de plata 925 con estrella negra"],
  ["o2sn7RbciJBxTIZkZyewfn", "Argollas de plata 925 con detalle rectangular calado"],
  ["J83YxrOiC95hgF4anfdsYX", "Argollas colgantes de plata 925 con circonia triangular"],
  ["J83YxrOiC95hgF4anfdsfX", "Argollas colgantes de plata 925 con doble corazón pavé"],
  ["dHIt4AvkoimGdzNqYo6yPb", "Argollas pequeñas de plata 925 con frente de circonias"],
  ["J83YxrOiC95hgF4anfdszX", "Argollas anchas de plata 925 con pavé lateral"],
  ["dHIt4AvkoimGdzNqYo70R9", "Argollas clásicas redondas de plata 925"],
  ["J83YxrOiC95hgF4anfdtLX", "Argollas de plata 925 con piedra negra ovalada"],
  ["J83YxrOiC95hgF4anfdtXX", "Argollas de plata 925 con estrellas y lunas caladas"],
  ["o2sn7RbciJBxTIZkZyeyrf", "Argollas de plata 925 con borde texturado"],
  ["J83YxrOiC95hgF4anfdtmX", "Argollas de plata 925 con detalle ondulado"],
  ["dHIt4AvkoimGdzNqYo73lP", "Argollas anchas de plata 925 con cruz y circonias"],
  ["o2sn7RbciJBxTIZkZyezPd", "Argollas de plata 925 con dije de circonia"],
  ["o2sn7RbciJBxTIZkZyezn9", "Argollas de plata 925 con circonia solitaria"],
  ["J83YxrOiC95hgF4anfdu6X", "Argollas de plata 925 con estrellas negras"],
  ["dHIt4AvkoimGdzNqYo75vv", "Argollas de plata 925 con dije mariposa"],
  ["J83YxrOiC95hgF4anfduMX", "Argollas cuadradas de plata 925 con circonias"],
  ["o2sn7RbciJBxTIZkZyf0qT", "Argollas de plata 925 con frente facetado"],
  ["dHIt4AvkoimGdzNqYo775f", "Argollas anchas de plata 925 con circonias rectangulares"],
  ["dHIt4AvkoimGdzNqYo77Nb", "Argollas colgantes de plata 925 con medallón multicolor"],
  ["J83YxrOiC95hgF4anfdujX", "Argollas de plata 925 con detalle rosado"],
  ["dHIt4AvkoimGdzNqYo78tl", "Argollas hexagonales de plata 925"],
  ["J83YxrOiC95hgF4anfduwX", "Argollas de plata 925 con aro doble"],
  ["J83YxrOiC95hgF4anfdv3X", "Argollas torzadas de plata 925"],
  ["dHIt4AvkoimGdzNqYo7AUP", "Argollas delgadas de plata 925 con circonias"],
].map(([id, name]) => ({ id, name }));

if (productNames.length !== 48) {
  throw new Error(`La migración debe contener 48 productos; contiene ${productNames.length}.`);
}

const ids = productNames.map(({ id }) => id);
const products = await client.fetch(
  `*[
    _type == "product" &&
    !(_id in path("drafts.**")) &&
    _id in $ids
  ]{
    _id,
    name,
    status,
    "imageAlt": image.alt,
    "hasImage": defined(image.asset._ref)
  }`,
  { ids },
);

const productsById = new Map(products.map((product) => [product._id, product]));
const genericNamePattern = /^(Anillo de compromiso de oro 18K|Argolla de plata) modelo \d+$/iu;
const missing = [];
const conflicts = [];
const changes = [];
const unchanged = [];

for (const target of productNames) {
  const product = productsById.get(target.id);

  if (!product) {
    missing.push(target);
    continue;
  }

  if (product.status === "hidden") {
    conflicts.push({
      ...target,
      currentName: product.name,
      reason: "el producto está oculto",
    });
    continue;
  }

  if (!product.hasImage) {
    conflicts.push({
      ...target,
      currentName: product.name,
      reason: "no tiene una imagen principal",
    });
    continue;
  }

  const nameIsTarget = product.name === target.name;
  const nameIsGeneric = genericNamePattern.test(product.name ?? "");

  if (!nameIsTarget && !nameIsGeneric) {
    conflicts.push({
      ...target,
      currentName: product.name,
      reason: "el nombre ya fue cambiado por otra persona",
    });
    continue;
  }

  const fields = {};

  if (!nameIsTarget) {
    fields.name = target.name;
  }

  if (product.imageAlt !== target.name) {
    fields["image.alt"] = target.name;
  }

  if (Object.keys(fields).length === 0) {
    unchanged.push({ ...target, currentName: product.name });
  } else {
    changes.push({ ...target, currentName: product.name, fields });
  }
}

console.log(shouldApply ? "MODO: APLICAR CAMBIOS" : "MODO: VISTA PREVIA (sin escrituras)");
console.log(`Mapeos definidos: ${productNames.length}`);
console.log(`Documentos encontrados: ${products.length}`);
console.log(`Productos por actualizar: ${changes.length}`);
console.log(`Productos ya actualizados: ${unchanged.length}`);
console.log(`Productos faltantes: ${missing.length}`);
console.log(`Conflictos de seguridad: ${conflicts.length}`);

if (missing.length > 0) {
  console.log("\nFaltantes:");
  for (const product of missing) {
    console.log(`- ${product.id}: ${product.name}`);
  }
}

if (conflicts.length > 0) {
  console.log("\nConflictos (no se sobrescribirán):");
  for (const product of conflicts) {
    console.log(`- ${product.id}: ${product.reason}; actual: ${product.currentName}`);
  }
}

if (!shouldApply) {
  console.log("\nCambios previstos:");
  for (const product of changes) {
    const fields = Object.keys(product.fields).join(" + ");
    console.log(`- ${product.id}: ${product.currentName} -> ${product.name} [${fields}]`);
  }
  console.log(
    "\nPara aplicar en PowerShell: $env:DELA_ROSA_APPLY_PRODUCT_NAMES='1'; .\\node_modules\\.bin\\sanity.cmd exec .\\scripts\\migrate-descriptive-product-names.mjs --with-user-token",
  );
  process.exitCode = missing.length || conflicts.length ? 1 : 0;
} else {
  if (missing.length > 0 || conflicts.length > 0) {
    throw new Error("Migración cancelada: hay documentos faltantes o conflictos de seguridad.");
  }

  if (changes.length > 0) {
    const transaction = client.transaction();

    for (const product of changes) {
      transaction.patch(product.id, (patch) => patch.set(product.fields));
    }

    await transaction.commit();
  }

  console.log(`\nMigración completada. Productos actualizados: ${changes.length}.`);
}
