import clientNewCatalog from "@/catalog/client-new-products.json";
import type { Product } from "./store";

export const clientNewProducts: Product[] = clientNewCatalog.map(
  (product) => ({
    id: product.sourceKey,
    name: product.name,
    category: product.category,
    material: product.material,
    price: 0,
    image: `/products/client/${product.file}`,
    imageFit: "contain",
    badge: "Nuevo",
    description:
      product.category === "Anillos"
        ? "Anillo de compromiso de oro 18K. Consultá disponibilidad y detalles por WhatsApp."
        : "Argolla de plata 925. Consultá disponibilidad y detalles por WhatsApp.",
  }),
);
