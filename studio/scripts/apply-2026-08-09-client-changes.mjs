import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-08-09" });

const duplicateWatchId = "uRAaNS3DcI72FPZjqiEHFm";
const primaryWatchId = "dHIt4AvkoimGdzNqYo7C0Z";

const categoryChanges = new Map([
  ["s9SDF4KJPK1qu893EWeNmc", "Cadenas"],
  ["s9SDF4KJPK1qu893EWeO1W", "Cadenas"],
  ["ry7RdNjYbUNrqXDXtJFgHh", "Anillos"],
  ["s9SDF4KJPK1qu893EWeOZ3", "Cadenas"],
  ["XbUtK7SfSWGo5mlbVE0VN6", "Cadenas"],
  ["s9SDF4KJPK1qu893EWeOz8", "Cadenas"],
  ["s9SDF4KJPK1qu893EWePaO", "Pulseras"],
  ["s9SDF4KJPK1qu893EWeSx2", "Aros"],
  ["XbUtK7SfSWGo5mlbVE1p4y", "Aros"],
  ["s9SDF4KJPK1qu893EWfhD5", "Aros"],
  ["delarosa-ga-003", "Cadenas"],
  ["delarosa-ga-010", "Cadenas"],
  ["delarosa-ga-012", "Cadenas"],
  ["delarosa-ga-023", "Pulseras"],
  ["delarosa-ga-032", "Pulseras"],
  ["delarosa-ga-034", "Cadenas"],
  ["delarosa-ga-035", "Cadenas"],
  ["delarosa-ga-036", "Pulseras"],
  ["delarosa-ga-037", "Cadenas"],
  ["delarosa-ga-040", "Cadenas"],
  ["delarosa-ga-041", "Cadenas"],
  ["delarosa-ga-080", "Pulseras"],
  ["delarosa-ga-090", "Cadenas"],
  ["delarosa-ga-004", "Sets"],
  ["delarosa-ga-017", "Sets"],
  ["delarosa-ga-018", "Anillos"],
]);

const galleryMerges = [
  {
    primaryId: "XbUtK7SfSWGo5mlbVE0H7x",
    duplicateIds: ["XbUtK7SfSWGo5mlbVE1m6p"],
  },
  {
    primaryId: "s9SDF4KJPK1qu893EWeRd4",
    duplicateIds: ["XbUtK7SfSWGo5mlbVE1n8i"],
  },
  {
    primaryId: "XbUtK7SfSWGo5mlbVE0Y9y",
    duplicateIds: ["XbUtK7SfSWGo5mlbVE1nvZ"],
  },
  {
    primaryId: "zSY4AE506svvUo5Hq7S4D7",
    duplicateIds: ["XbUtK7SfSWGo5mlbVE1o35"],
  },
  {
    primaryId: "s9SDF4KJPK1qu893EWeSx2",
    duplicateIds: [
      "XbUtK7SfSWGo5mlbVE1p4y",
      "s9SDF4KJPK1qu893EWfhD5",
    ],
  },
  {
    primaryId: "s9SDF4KJPK1qu893EWeQY0",
    duplicateIds: [
      "s9SDF4KJPK1qu893EWfeCn",
      "s9SDF4KJPK1qu893EWfeNy",
    ],
  },
  {
    primaryId: "XbUtK7SfSWGo5mlbVE0YWW",
    duplicateIds: ["zSY4AE506svvUo5Hq7TyKz"],
  },
  {
    primaryId: "zSY4AE506svvUo5Hq7S5qF",
    duplicateIds: ["zSY4AE506svvUo5Hq7TzHX"],
  },
];

const mergeDocumentIds = galleryMerges.flatMap((group) => [
  group.primaryId,
  ...group.duplicateIds,
]);

const [argollas, duplicateWatch, primaryWatch, mappedProducts, mergeDocuments] =
  await Promise.all([
    client.fetch(
      `*[_type == "product" && !(_id in path("drafts.**")) && category == "Argollas de plata"]{_id, name}`,
    ),
    client.fetch(
      `*[_type == "product" && _id == $id][0]{_id, name, image}`,
      { id: duplicateWatchId },
    ),
    client.fetch(
      `*[_type == "product" && _id == $id][0]{_id, name, gallery}`,
      { id: primaryWatchId },
    ),
    client.fetch(
      `*[_type == "product" && _id in $ids]{_id, name, category}`,
      { ids: [...categoryChanges.keys()] },
    ),
    client.fetch(
      `*[_type == "product" && _id in $ids]{_id, name, image, gallery}`,
      { ids: mergeDocumentIds },
    ),
  ]);

if (!duplicateWatch?.image?.asset?._ref || !primaryWatch?._id) {
  throw new Error("No se encontraron los dos relojes infantiles esperados.");
}

const categoryTransaction = client.transaction();

for (const product of argollas) {
  categoryTransaction.patch(product._id, (patch) =>
    patch.set({ category: "Aros" }),
  );
}

for (const product of mappedProducts) {
  const nextCategory = categoryChanges.get(product._id);
  if (nextCategory && product.category !== nextCategory) {
    categoryTransaction.patch(product._id, (patch) =>
      patch.set({ category: nextCategory }),
    );
  }
}

categoryTransaction.patch("delarosa-ga-054", (patch) =>
  patch.set({ name: "Reloj dama Q&Q bicolor de esfera nácar" }),
);
categoryTransaction.patch("uRAaNS3DcI72FPZjqiEQkU", (patch) =>
  patch.set({ name: "Reloj dama Q&Q bicolor con cristales" }),
);

await categoryTransaction.commit();

const duplicateTransaction = client.transaction();

const duplicateAssetRef = duplicateWatch.image.asset._ref;
const gallery = Array.isArray(primaryWatch.gallery) ? primaryWatch.gallery : [];
const galleryHasDuplicatePhoto = gallery.some(
  (image) => image?.asset?._ref === duplicateAssetRef,
);

if (!galleryHasDuplicatePhoto) {
  duplicateTransaction.patch(primaryWatchId, (patch) =>
    patch.set({
      gallery: [
        ...gallery,
        {
          _type: "image",
          _key: "vista-empaque-rosa",
          asset: { _type: "reference", _ref: duplicateAssetRef },
          alt: "Reloj infantil digital Daniel Klein coral, vista en empaque",
        },
      ],
    }),
  );
}

duplicateTransaction.patch(duplicateWatchId, (patch) =>
  patch.set({ status: "hidden", featured: false }),
);

const mergeDocumentsById = new Map(
  mergeDocuments.map((document) => [document._id, document]),
);

for (const group of galleryMerges) {
  const primary = mergeDocumentsById.get(group.primaryId);
  if (!primary) {
    throw new Error(`No se encontró el producto principal ${group.primaryId}.`);
  }

  const primaryGallery = Array.isArray(primary.gallery) ? primary.gallery : [];
  const existingRefs = new Set(
    primaryGallery.map((image) => image?.asset?._ref).filter(Boolean),
  );
  const additions = [];

  for (const duplicateId of group.duplicateIds) {
    const duplicate = mergeDocumentsById.get(duplicateId);
    const assetRef = duplicate?.image?.asset?._ref;

    if (!duplicate || !assetRef) {
      throw new Error(`No se encontró la foto del duplicado ${duplicateId}.`);
    }

    if (!existingRefs.has(assetRef)) {
      additions.push({
        _type: "image",
        _key: `vista-${duplicateId.slice(-8)}`,
        asset: { _type: "reference", _ref: assetRef },
        alt: duplicate.image.alt || `${primary.name}, vista adicional`,
      });
      existingRefs.add(assetRef);
    }

    duplicateTransaction.patch(duplicateId, (patch) =>
      patch.set({ status: "hidden", featured: false }),
    );
  }

  if (additions.length) {
    duplicateTransaction.patch(group.primaryId, (patch) =>
      patch.set({ gallery: [...primaryGallery, ...additions] }),
    );
  }
}

await duplicateTransaction.commit({ autoGenerateArrayKeys: true });

console.log(`Argollas movidas a Aros: ${argollas.length}`);
console.log(`Productos revisados por tipo real: ${mappedProducts.length}`);
console.log("Reloj infantil rosa duplicado oculto; su foto quedó en la galería.");
console.log(
  `Fichas de vistas adicionales organizadas: ${galleryMerges.reduce(
    (total, group) => total + group.duplicateIds.length,
    0,
  )}`,
);
