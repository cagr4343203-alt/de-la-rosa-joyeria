import { createClient } from "next-sanity";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "224225np",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-07-29",
  // El sitio público solo consume contenido publicado. La CDN de Sanity evita
  // repetir consultas al origen en cada navegación y la revalidación por tags
  // mantiene los cambios del panel actualizados.
  useCdn: true,
});
