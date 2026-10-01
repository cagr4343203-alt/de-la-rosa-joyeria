import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/product-detail";
import { getProducts } from "@/sanity/lib/products";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const requestedSlug = decodeURIComponent(slug)
    .trim()
    .toLocaleLowerCase("es");

  const products = await getProducts();

  const product = products.find(
    (item) =>
      item.growthSlug?.trim().toLocaleLowerCase("es") ===
      requestedSlug,
  );

  if (!product) {
    notFound();
  }

  const sameCategory = products.filter(
    (item) =>
      item.id !== product.id &&
      item.category === product.category,
  );

  const sameMaterial = products.filter(
    (item) =>
      item.id !== product.id &&
      item.category !== product.category &&
      item.material === product.material,
  );

  const others = products.filter(
    (item) =>
      item.id !== product.id &&
      item.category !== product.category &&
      item.material !== product.material,
  );

  const recommendedProducts = [
    ...sameCategory,
    ...sameMaterial,
    ...others,
  ].slice(0, 3);

  return (
    <ProductDetail
      product={product}
      recommendedProducts={recommendedProducts}
    />
  );
}
