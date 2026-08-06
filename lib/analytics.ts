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

export function trackSearch(searchTerm: string, resultsCount: number) {
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
    socialNetwork === "instagram" ? "clic_instagram" : "clic_whatsapp",
    {
      social_network: socialNetwork,
      link_location: location,
    },
  );
}