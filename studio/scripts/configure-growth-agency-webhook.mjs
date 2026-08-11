import { getCliClient } from "sanity/cli";

const secret = process.env.SANITY_WEBHOOK_SECRET;
if (!secret) throw new Error("Missing SANITY_WEBHOOK_SECRET");

const client = getCliClient({ apiVersion: "2025-02-19" });
const projectId = client.config().projectId;
const uri = `/hooks/projects/${projectId}`;
const name = "Growth Agency bidirectional sync";
const supportedTypes = [
  "product", "productMaterial", "promotion", "siteSettings", "reservationPage",
  "aboutPage", "locationPage", "homeHero", "homeServices", "homeCategories",
  "homeFeatured", "homePiercing", "homeHistory", "homeLocation",
];

const hooks = await client.request({ uri, method: "GET" });
for (const hook of hooks.filter((item) => item.name === name)) {
  await client.request({ uri: `${uri}/${hook.id}`, method: "DELETE" });
}

const created = await client.request({
  uri,
  method: "POST",
  body: {
    type: "document",
    name,
    url: "https://ufgnmsxvkeqhjusjdwcb.supabase.co/functions/v1/sanity-webhook",
    dataset: "production",
    description: "Synchronizes Dela Rosa public content with Growth Agency.",
    rule: {
      on: ["create", "update", "delete"],
      filter: `_type in ${JSON.stringify(supportedTypes)}`,
      projection: "{_id,_type,_updatedAt}",
    },
    apiVersion: "v2026-08-11",
    httpMethod: "POST",
    includeDrafts: false,
    includeAllVersions: false,
    headers: {},
    secret,
    isDisabledByUser: false,
  },
});

if (!created?.id) throw new Error("Sanity did not create the webhook");
console.log("sanity-webhook-configured=true");
