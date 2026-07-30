import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-29" });
const projectRoot = resolve(import.meta.dirname, "../..");
const sourceKey = "argollas-trenzadas";
const filename = "03-anillos.jpg";

const product = await client.fetch(
  `*[_type == "product" && sourceKey == $sourceKey][0]{_id}`,
  { sourceKey },
);

if (!product?._id) {
  throw new Error("No se encontró el producto Argollas Trenzadas.");
}

const asset = await client.assets.upload(
  "image",
  createReadStream(resolve(projectRoot, "public", "products", filename)),
  { filename },
);

await client
  .patch(product._id)
  .set({
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt: "Argollas Trenzadas de Dela Rosa",
    },
    referentialImage: false,
  })
  .commit();

console.log("✓ Foto de Argollas Trenzadas corregida.");
