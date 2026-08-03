import { notFound, redirect } from "next/navigation";

const canonicalRoutes = new Set([
  "/productos",
  "/combos",
  "/nosotros",
  "/reservas",
  "/ubicacion",
]);

function removeInvisibleCharacters(segment: string) {
  return segment.normalize("NFKC").replace(/[\p{Cf}\p{Z}\s]/gu, "");
}

export default async function RecoverMalformedRoute({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const recoveredPath = `/${slug.map(removeInvisibleCharacters).join("/")}`;

  if (canonicalRoutes.has(recoveredPath)) {
    redirect(recoveredPath);
  }

  notFound();
}
