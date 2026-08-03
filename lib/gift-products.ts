import giftCatalogData from "@/catalog/gift-products.json";
import type { Product } from "./store";

type GiftCatalogEntry = {
  file: string;
  sourceKey: string;
  name: string;
  category: string;
  material: string;
};

const giftCatalog = giftCatalogData as GiftCatalogEntry[];

export const giftProducts: Product[] = giftCatalog.map((gift, index) => ({
  id: gift.sourceKey,
  name: gift.name,
  category: gift.category,
  material: gift.material,
  price: 0,
  image: `/products/gifts/${gift.file}`,
  badge: "Nuevo",
  description:
    "Foto real de Dela Rosa. Consultá disponibilidad y precio por WhatsApp.",
  status: "available",
}));
