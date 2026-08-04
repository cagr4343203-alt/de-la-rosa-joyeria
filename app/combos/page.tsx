import { ProductCatalog } from "@/components/product-catalog";
import { getProducts } from "@/sanity/lib/products";

export const metadata = {
  title: "Combos",
  description:
    "Combos de joyas, relojes y regalos para momentos especiales en Dela Rosa, Encarnación.",
  alternates: {
    canonical: "/combos",
  },
};

export default async function CombosPage() {
  const products = await getProducts();

  return (
    <ProductCatalog
      products={products}
      initialCategory="Combos"
      title="Combos"
    />
  );
}
