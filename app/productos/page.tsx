import { ProductCatalog } from "@/components/product-catalog";
import { getProducts } from "@/sanity/lib/products";

export const metadata = {
  title: "Productos",
  description:
    "Catálogo de joyas, relojes, pulseras, aros, bombillas y regalos de Dela Rosa en Encarnación, Paraguay.",
  alternates: {
    canonical: "/productos",
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const [products, params] = await Promise.all([getProducts(), searchParams]);

  return (
    <ProductCatalog
      products={products}
      initialCategory={params.categoria ?? "Todo"}
    />
  );
}
