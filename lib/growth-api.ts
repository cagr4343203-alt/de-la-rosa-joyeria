export const GROWTH_API_URL = "https://ufgnmsxvkeqhjusjdwcb.supabase.co";
export const GROWTH_API_KEY = "sb_publishable_eqAdT_-7_59g4qKoX7DLMg_ERZyxRF4";
export const GROWTH_SITE_SLUG = "dela-rosa-joyeria";

export const FALLBACK_GROWTH_MATERIALS = [
  "Oro 18K",
  "Plata",
  "Plata 925",
  "Plata bañada en oro",
  "Plata Gold",
  "Plata bañada en oro rosa",
];

type GrowthMaterial = {
  name?: unknown;
};

type GrowthPublicSite = {
  materials?: GrowthMaterial[];
};

export async function getGrowthMaterials() {
  try {
    const response = await fetch(`${GROWTH_API_URL}/rest/v1/rpc/get_public_site`, {
      method: "POST",
      headers: {
        apikey: GROWTH_API_KEY,
        authorization: `Bearer ${GROWTH_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ requested_site_slug: GROWTH_SITE_SLUG }),
      next: { revalidate: 60, tags: ["growth-materials"] },
    });
    if (!response.ok) return FALLBACK_GROWTH_MATERIALS;

    const site = (await response.json()) as GrowthPublicSite | null;
    const names = (site?.materials ?? [])
      .map((material) => typeof material.name === "string" ? material.name.trim() : "")
      .filter(Boolean);

    return names.length ? names : FALLBACK_GROWTH_MATERIALS;
  } catch {
    return FALLBACK_GROWTH_MATERIALS;
  }
}

const VISITOR_STORAGE_KEY = "delaRosaGrowthVisitorId";

export function getGrowthVisitorId() {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(VISITOR_STORAGE_KEY);
    if (saved) return saved;
    const value = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_STORAGE_KEY, value);
    return value;
  } catch {
    return crypto.randomUUID();
  }
}
