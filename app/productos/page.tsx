import { ProductCatalog } from "@/components/product-catalog";
import { getGrowthMaterials } from "@/lib/growth-api";
import { getProducts } from "@/sanity/lib/products";

export const metadata = {
  title: "Catálogo de joyas y relojes en Encarnación",
  description:
    "Explorá el catálogo de Dela Rosa: joyas de oro 18K, plata 925, anillos, aros, cadenas, pulseras, relojes y regalos en Encarnación, Paraguay.",
  alternates: {
    canonical: "/productos",
  },
};

export default async function ProductsPage() {
  const [products, managedMaterials] = await Promise.all([
    getProducts(),
    getGrowthMaterials(),
  ]);

  return (
    <ProductCatalog
      products={products}
      managedMaterials={managedMaterials}
    />
  );
}
