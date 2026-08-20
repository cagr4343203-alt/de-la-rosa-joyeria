"use client";

import {
  GROWTH_API_KEY,
  GROWTH_API_URL,
  GROWTH_SITE_SLUG,
  getGrowthVisitorId,
} from "@/lib/growth-api";

const SESSION_STORAGE_KEY = "delaRosaGrowthSessionId";

function anonymousId(storage: Storage, key: string) {
  try {
    const saved = storage.getItem(key);
    if (saved) return saved;
    const value = crypto.randomUUID();
    storage.setItem(key, value);
    return value;
  } catch {
    return crypto.randomUUID();
  }
}

function referrerHost() {
  try {
    return document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    return "";
  }
}

export function trackGrowthAgencyEvent(
  eventType: "page_view" | "product_view" | "whatsapp_click" | "social_click",
  source: string,
  productSlug?: string | null,
) {
  if (typeof window === "undefined") return Promise.resolve();

  return fetch(`${GROWTH_API_URL}/rest/v1/rpc/track_public_event`, {
    method: "POST",
    headers: {
      apikey: GROWTH_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requested_site_slug: GROWTH_SITE_SLUG,
      requested_event_type: eventType,
      requested_visitor_id: getGrowthVisitorId(),
      requested_session_id: anonymousId(sessionStorage, SESSION_STORAGE_KEY),
      requested_page_path: `${window.location.pathname}${window.location.search}`.slice(0, 240),
      requested_source: String(source || "website").slice(0, 80),
      requested_product_slug: productSlug || null,
      requested_referrer_host: referrerHost().slice(0, 240),
      requested_metadata: {},
    }),
    keepalive: eventType === "whatsapp_click" || eventType === "social_click",
  }).then(() => undefined).catch(() => undefined);
}
