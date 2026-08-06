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
  id: string;
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
        item_id: product.id,
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
  id: string;
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
        item_id: product.id,
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
  id: string;
  name: string;
  category: string;
}) {
  trackEvent("generate_lead", {
    lead_source: "whatsapp",
    lead_type: "consulta_producto",
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
  });
}

export function trackSearch(searchTerm: string, resultsCount: number) {
  trackEvent("view_search_results", {
    search_term: searchTerm,
    results_count: resultsCount,
  });
}

export function trackReservationClick(location: string) {
  trackEvent("generate_lead", {
    lead_source: "whatsapp",
    lead_type: "reserva_perforacion",
    link_location: location,
  });
}

export function trackSocialClick(
  socialNetwork: "instagram" | "whatsapp",
  location: string,
) {
  trackEvent("social_click", {
    social_network: socialNetwork,
    link_location: location,
  });
}