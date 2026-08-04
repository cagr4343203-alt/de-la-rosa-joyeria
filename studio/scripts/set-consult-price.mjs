import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

const client = process.env.SANITY_AUTH_TOKEN
  ? createClient({
      projectId: "224225np",
      dataset: "production",
      apiVersion: "2026-08-04",
      useCdn: false,
      token: process.env.SANITY_AUTH_TOKEN,
    })
  : getCliClient({ apiVersion: "2026-08-04" });
const products = await client.fetch(
  `*[_type == "product" && price != 0]{_id, name}`,
);

for (const product of products) {
  await client.patch(product._id).set({ price: 0 }).commit();
  console.log(`✓ ${product.name}`);
}

console.log(`Precios reemplazados por consulta: ${products.length} productos.`);
