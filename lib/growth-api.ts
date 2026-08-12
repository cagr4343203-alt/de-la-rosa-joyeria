export const GROWTH_API_URL = "https://ufgnmsxvkeqhjusjdwcb.supabase.co";
export const GROWTH_API_KEY = "sb_publishable_eqAdT_-7_59g4qKoX7DLMg_ERZyxRF4";
export const GROWTH_SITE_SLUG = "dela-rosa-joyeria";

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
