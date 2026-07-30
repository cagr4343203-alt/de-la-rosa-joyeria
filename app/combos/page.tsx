import { ProductCatalog } from "@/components/product-catalog";
import { getProducts } from "@/sanity/lib/products";

export const metadata = {
  title: "Combos",
  description:
    "Combos de regalos DELAROSA, administrados desde nuestro catálogo.",
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
