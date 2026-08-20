import type { CartLine } from "@/lib/store";
import { trackGrowthAgencyEvent } from "@/lib/growth-analytics";

export type AnalyticsParameters = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      parameters?: AnalyticsParameters,
    ) => void;
  }
}

/**
 * Envía un evento a Google Analytics.
 * Si Analytics todavía no cargó, no genera errores en la página.
 */
export function trackEvent(
  eventName: string,
  parameters: AnalyticsParameters = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, parameters);
}

export function trackProductView(product: {
  id: string | number;
  name: string;
  category: string;
  material: string;
  price: number;
}) {
  trackGrowthAgencyEvent("product_view", "product_gallery", String(product.id));
  trackEvent("view_item", {
    currency: "PYG",
    value: product.price,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_category: product.category,
        item_variant: product.material,
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

export function trackAddToCart(product: {
  id: string | number;
  name: string;
  category: string;
  material: string;
  price: number;
}) {
  trackEvent("add_to_cart", {
    currency: "PYG",
    value: product.price,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_category: product.category,
        item_variant: product.material,
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

export function trackProductConsultation(product: {
  id: string | number;
  name: string;
  category: string;
}) {
  trackEvent("consulta_producto_whatsapp", {
    item_id: String(product.id),
    item_name: product.name,
    item_category: product.category,
    contact_method: "whatsapp",
  });
}

export function trackSearch(
  searchTerm: string,
  resultsCount: number,
) {
  trackEvent("busqueda_producto", {
    search_term: searchTerm,
    results_count: resultsCount,
  });
}

export function trackReservationClick(location: string) {
  trackEvent("reserva_perforacion_whatsapp", {
    link_location: location,
    contact_method: "whatsapp",
  });
}

export function trackSocialClick(
  socialNetwork: "instagram" | "whatsapp",
  location: string,
) {
  trackEvent(
    socialNetwork === "instagram"
      ? "clic_instagram"
      : "clic_whatsapp",
    {
      social_network: socialNetwork,
      link_location: location,
    },
  );
}

/**
 * Registra el momento en que el cliente presiona
 * "Enviar pedido por WhatsApp" desde el carrito.
 *
 * Envía:
 * - productos seleccionados;
 * - cantidades;
 * - categorías;
 * - materiales;
 * - total conocido;
 * - si hay productos sin precio.
 */
export function trackCartWhatsAppCheckout(
  cart: CartLine[],
  orderSummaryUrl?: string,
) {
  if (cart.length === 0) {
    return;
  }

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const pricedTotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.price > 0
        ? item.price * item.quantity
        : 0),
    0,
  );

  const hasUnpricedProducts = cart.some(
    (item) => item.price <= 0,
  );

  const items = cart.map((item) => ({
    item_id: String(item.id),
    item_name: item.name,
    item_category: item.category,
    item_variant: item.material,
    price: item.price,
    quantity: item.quantity,
  }));

  const parameters: AnalyticsParameters = {
    currency: "PYG",
    value: pricedTotal,
    item_count: itemCount,
    distinct_products: cart.length,
    has_unpriced_products: hasUnpricedProducts
      ? "yes"
      : "no",
    contact_method: "whatsapp",
    order_summary_url: orderSummaryUrl ?? "",
    items,
  };

  /*
   * Evento estándar de comercio electrónico.
   * Permite analizar qué productos llegaron al proceso
   * de consulta o pedido.
   */
  trackEvent("begin_checkout", parameters);

  /*
   * Evento personalizado con un nombre fácil de entender.
   * Este es el que luego marcaremos como evento clave.
   */
  trackEvent("pedido_carrito_whatsapp", parameters);
}
