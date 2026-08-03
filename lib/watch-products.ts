import watchCatalogData from "@/catalog/watch-products.json";
import type { Product } from "./store";

type WatchCatalogEntry = {
  file: string;
  name: string;
  category: string;
  material: string;
};

const watchCatalog = watchCatalogData as WatchCatalogEntry[];

export const watchProducts: Product[] = watchCatalog.map((watch, index) => ({
  id: `watch-${index + 1}`,
  name: watch.name,
  category: watch.category,
  material: watch.material,
  price: 0,
  image: `/products/watches/${watch.file}`,
  imageFit: "contain",
  badge: "Nuevo",
  description:
    "Foto real de Dela Rosa. Consultá disponibilidad y precio por WhatsApp.",
  status: "available",
}));
