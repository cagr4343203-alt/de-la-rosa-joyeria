"use client";

import type { CartLine } from "@/lib/store";
import {
  GROWTH_API_KEY,
  GROWTH_API_URL,
  GROWTH_SITE_SLUG,
  getGrowthVisitorId,
} from "@/lib/growth-api";

const SITE_URL = "https://delarosajoyeria.com";

export function createLegacyOrderUrl(cart: CartLine[]) {
  const selectedItems = cart
    .map((item) => {
      const id = encodeURIComponent(String(item.id));
      return item.quantity > 1 ? `${id}~${item.quantity}` : id;
    })
    .join(",");
  return `${SITE_URL}/pedido?p=${selectedItems}`;
}

export async function createShortOrderUrl(cart: CartLine[]) {
  const visitorId = getGrowthVisitorId();
  if (!visitorId || cart.length === 0) return createLegacyOrderUrl(cart);

  try {
    const response = await fetch(`${GROWTH_API_URL}/rest/v1/rpc/create_order_link`, {
      method: "POST",
      headers: {
        apikey: GROWTH_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requested_site_slug: GROWTH_SITE_SLUG,
        requested_visitor_id: visitorId,
        requested_items: cart.map((item) => ({
          id: String(item.id),
          quantity: item.quantity,
        })),
      }),
    });
    if (!response.ok) return createLegacyOrderUrl(cart);
    const code = await response.json() as unknown;
    return typeof code === "string" && /^[0-9a-f]{10}$/.test(code)
      ? `${SITE_URL}/p/${code}`
      : createLegacyOrderUrl(cart);
  } catch {
    return createLegacyOrderUrl(cart);
  }
}
