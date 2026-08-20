import { ProductCatalog } from "@/components/product-catalog";
import { getGrowthMaterials } from "@/lib/growth-api";
import { getProducts } from "@/sanity/lib/products";

export const metadata = {
  title: "Combos de joyas y regalos en Encarnación",
  description:
    "Combos de joyas, relojes y regalos para momentos especiales en Dela Rosa, Encarnación.",
  alternates: {
    canonical: "/combos",
  },
};

export default async function CombosPage() {
  const [products, managedMaterials] = await Promise.all([
    getProducts(),
    getGrowthMaterials(),
  ]);

  return (
    <ProductCatalog
      products={products}
      managedMaterials={managedMaterials}
      initialCategory="Combos"
      title="Combos"
    />
  );
}
