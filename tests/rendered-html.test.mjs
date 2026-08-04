import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(new URL(pathname, "http://localhost/"), {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the Dela Rosa storefront", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Dela Rosa|DELA ROSA/);
  assert.match(html, /El detalle exclusivo/);
  assert.match(html, /Reservar perforaci/);
  assert.match(html, /Productos destacados/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /https:\/\/delarosajoyeria\.com/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("publishes SEO discovery files for the canonical domain", async () => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    render("/robots.txt"),
    render("/sitemap.xml"),
  ]);

  assert.equal(robotsResponse.status, 200);
  assert.match(await robotsResponse.text(), /delarosajoyeria\.com\/sitemap\.xml/);

  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /https:\/\/delarosajoyeria\.com\/productos/);
  assert.match(sitemap, /https:\/\/delarosajoyeria\.com\/reservas/);
});

test("recovers product links containing invisible characters", async () => {
  const response = await render("/productos%E2%81%A0");

  assert.ok([307, 308].includes(response.status));
  assert.equal(
    new URL(response.headers.get("location"), "http://localhost/").pathname,
    "/productos",
  );
});
