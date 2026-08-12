import { redirect } from "next/navigation";
import {
  GROWTH_API_KEY,
  GROWTH_API_URL,
  GROWTH_SITE_SLUG,
} from "@/lib/growth-api";

type LinkedItem = { id?: unknown; quantity?: unknown };

export default async function ShortOrderPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  if (!/^[0-9a-f]{10}$/i.test(code)) redirect("/pedido");

  const response = await fetch(`${GROWTH_API_URL}/rest/v1/rpc/get_order_link`, {
    method: "POST",
    headers: {
      apikey: GROWTH_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requested_site_slug: GROWTH_SITE_SLUG,
      requested_code: code.toLowerCase(),
    }),
    cache: "no-store",
  });
  if (!response.ok) redirect("/pedido");

  const payload = await response.json() as unknown;
  const items = Array.isArray(payload) ? payload as LinkedItem[] : [];
  const compact = items.flatMap((item) => {
    const id = String(item.id ?? "").trim();
    const quantity = Math.max(1, Math.min(99, Number(item.quantity) || 1));
    return id ? [`${encodeURIComponent(id)}${quantity > 1 ? `~${quantity}` : ""}`] : [];
  }).join(",");

  redirect(compact ? `/pedido?p=${compact}` : "/pedido");
}
