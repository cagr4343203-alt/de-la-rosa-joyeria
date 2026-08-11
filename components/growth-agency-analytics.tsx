"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackGrowthAgencyEvent } from "@/lib/growth-analytics";

function socialNetwork(url: URL) {
  const hostname = url.hostname.toLowerCase();
  if (hostname.includes("instagram.com")) return "instagram";
  if (hostname.includes("tiktok.com")) return "tiktok";
  if (hostname.includes("facebook.com") || hostname.includes("fb.com")) return "facebook";
  if (hostname.includes("google.com") || hostname.includes("goo.gl")) return "maps";
  return null;
}

export function GrowthAgencyAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    trackGrowthAgencyEvent("page_view", "website");
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      const product = anchor.closest<HTMLElement>("[data-growth-product-slug]");
      const productSlug = product?.dataset.growthProductSlug || null;
      const href = url.href.toLowerCase();

      if (href.includes("wa.me/") || href.includes("whatsapp.com/")) {
        const source = productSlug
          ? "product_card"
          : anchor.closest(".cart-drawer")
            ? "cart"
            : anchor.closest("header")
              ? "header"
              : anchor.closest("footer")
                ? "footer"
                : "page";
        trackGrowthAgencyEvent("whatsapp_click", source, productSlug);
        return;
      }

      const network = socialNetwork(url);
      if (network) trackGrowthAgencyEvent("social_click", network, productSlug);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
