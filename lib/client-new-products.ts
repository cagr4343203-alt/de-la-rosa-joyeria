import clientNewCatalog from "@/catalog/client-new-products.json";
import clientAugustCatalog from "@/catalog/client-products-august.json";
import type { Product } from "./store";

const clientCatalog = [...clientNewCatalog, ...clientAugustCatalog];

function productDescription(product: (typeof clientCatalog)[number]) {
  if (product.category === "Anillos") {
    return "Anillo de compromiso de oro 18K. Consultá disponibilidad y detalles por WhatsApp.";
  }

  if (product.category === "Reloj infantil") {
    return "Reloj infantil. Consultá disponibilidad, características y precio por WhatsApp.";
  }

  if (product.sourceKey.startsWith("argolla-plata-")) {
    return "Argolla de plata 925. Consultá disponibilidad y detalles por WhatsApp.";
  }

  return "Aros de plata 925. Consultá disponibilidad y detalles por WhatsApp.";
}

export const clientNewProducts: Product[] = clientCatalog.map(
  (product) => ({
    id: product.sourceKey,
    name: product.name,
    category: product.category,
    material: product.material,
    price: 0,
    image: `/products/client/${product.file}`,
    imageFit: "contain",
    badge: "Nuevo",
    description: productDescription(product),
  }),
);
