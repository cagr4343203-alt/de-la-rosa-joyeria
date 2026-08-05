import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-08-05" });

const incorrectRingId = "o2sn7RbciJBxTIZkZydtyz";
const chainId = "5dA3YRRbLXuVj5iWwIsQMp";

await client
  .patch(incorrectRingId)
  .set({ status: "hidden", featured: false })
  .commit();

await client
  .patch(chainId)
  .set({ sourceKey: "cadena-jade-delicada" })
  .commit();

console.log("Catálogo corregido: duplicado oculto e identificador de cadena normalizado.");
