import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import ts from "typescript";
import { NextRequest } from "next/server.js";
import testing from "next/experimental/testing/server.js";
import routeData from "next/dist/build/webpack/loaders/metadata/resolve-route-data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { unstable_doesMiddlewareMatch } = testing;
const { resolveRouteData } = routeData;

// Load the TypeScript modules without requiring another test runner dependency.
function loadTypeScript(relativePath) {
  const filename = path.resolve(__dirname, "..", relativePath);
  const localRequire = createRequire(filename);
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const requireModule = (specifier) => specifier.startsWith(".")
    ? loadTypeScript(path.resolve(path.dirname(filename), `${specifier}.ts`))
    : localRequire(specifier);
  new Function("require", "exports", code)(requireModule, exports);
  return exports;
}

const { proxy, config } = loadTypeScript("proxy.ts");
const { explorationAreas, landing, resources, faqs } = loadTypeScript("lib/landing.ts");
const { contentSignals, prefersMarkdown } = loadTypeScript("lib/agent-content.ts");

test("negotiation respects quality values and keeps HTML as the default", () => {
  for (const accept of [null, "*/*", "text/html", "text/markdown;q=0", "text/markdown;q=invalid", "text/markdown;q=0.2, text/html;q=0.9", "text/markdown;q=0, */*;q=1"]) {
    assert.equal(prefersMarkdown(accept), false, String(accept));
  }
  for (const accept of ["text/markdown", "TEXT/MARKDOWN; charset=utf-8", "text/markdown, text/html", "text/markdown;q=0.9, text/html;q=0.2", "text/markdown;q=0.5, text/html;q=0, */*;q=1"]) {
    assert.equal(prefersMarkdown(accept), true, accept);
  }
});

test("Markdown requests receive the embodied intelligence landing content and policy", async () => {
  const response = proxy(new NextRequest("https://embodystar.com/", { headers: { Accept: "text/markdown" } }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.equal(response.headers.get("vary"), "Accept");
  assert.equal(response.headers.get("content-signal"), contentSignals);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = await response.text();
  assert.match(body, /^# EmbodyStar/);
  assert.doesNotMatch(body, /<script|<style|<div/);
  assert.ok(body.includes(landing.description));
  for (const area of explorationAreas) {
    assert.ok(body.includes(`### ${area.title}`));
    assert.ok(body.includes(area.description));
  }
  for (const resource of resources) assert.ok(body.includes(resource.url));
  for (const faq of faqs) assert.ok(body.includes(faq.answer));
  assert.doesNotMatch(body, /demo price|shopping bag|checkout|USD/i);
});

test("browser, RSC, and mutation requests continue to Next.js", () => {
  for (const options of [{}, { headers: { Accept: "text/html" } }, { headers: { Accept: "text/x-component", RSC: "1" } }, { method: "POST", headers: { Accept: "text/markdown" } }]) {
    const response = proxy(new NextRequest("https://embodystar.com/", options));
    assert.equal(response.headers.get("x-middleware-next"), "1");
    assert.equal(response.headers.get("content-type"), null);
    assert.equal(response.headers.get("vary"), "Accept");
    assert.equal(response.headers.get("content-signal"), contentSignals);
  }
});

test("HEAD has Markdown headers and no response body", async () => {
  const response = proxy(new NextRequest("https://embodystar.com/", { method: "HEAD", headers: { Accept: "text/markdown" } }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.equal(await response.text(), "");
});

test("HTML and Markdown GET and HEAD responses advertise the API catalog", () => {
  for (const method of ["GET", "HEAD"]) {
    for (const accept of ["text/html", "text/markdown"]) {
      const response = proxy(new NextRequest("https://embodystar.com/", {
        method,
        headers: { Accept: accept },
      }));
      const link = response.headers.get("link");
      assert.match(link, /<https:\/\/embodystar\.com\/\.well-known\/api-catalog>/);
      assert.match(link, /rel="api-catalog"/);
      assert.match(link, /type="application\/linkset\+json"/);
    }
  }
});

test("API catalog GET and HEAD expose the Linkset media type and discovery relation", async () => {
  const { GET, HEAD } = loadTypeScript("app/.well-known/api-catalog/route.ts");
  const get = await GET();
  const head = await HEAD();
  for (const response of [get, head]) {
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /^application\/linkset\+json(?:;|$)/);
    assert.match(response.headers.get("content-type"), /profile="https:\/\/www\.rfc-editor\.org\/info\/rfc9727"/);
    assert.match(response.headers.get("link"), /<https:\/\/embodystar\.com\/\.well-known\/api-catalog>;\s*rel="api-catalog"/);
  }
  assert.equal(head.headers.get("content-type"), get.headers.get("content-type"));
  assert.equal(head.headers.get("link"), get.headers.get("link"));
  assert.equal(await head.text(), "");

  const catalog = await get.json();
  assert.ok(Array.isArray(catalog.linkset) && catalog.linkset.length > 0);
  const anchors = new Set();
  for (const api of catalog.linkset) {
    assert.equal(new URL(api.anchor).protocol, "https:");
    assert.ok(!anchors.has(api.anchor), `Duplicate API anchor: ${api.anchor}`);
    anchors.add(api.anchor);
    for (const relation of ["service-desc", "service-doc"]) {
      assert.ok(Array.isArray(api[relation]) && api[relation].length > 0, relation);
      for (const link of api[relation]) {
        assert.equal(new URL(link.href).protocol, "https:");
        assert.equal(typeof link.type, "string");
      }
    }
  }
});

test("catalog links resolve to a spec and docs for the actual public content interface", async () => {
  const { GET } = loadTypeScript("app/.well-known/api-catalog/route.ts");
  const { linkset } = await (await GET()).json();
  const contentApi = linkset.find((api) => api.anchor === "https://embodystar.com/");
  assert.ok(contentApi, "The existing homepage content interface must be discoverable");
  const specLink = contentApi["service-desc"].find((link) => link.type === "application/json");
  const docsLink = contentApi["service-doc"].find((link) => link.type === "text/markdown");
  assert.ok(specLink);
  assert.ok(docsLink);
  const readPublicLink = (link) => {
    const url = new URL(link.href);
    assert.equal(url.origin, "https://embodystar.com");
    return fs.readFileSync(path.join(__dirname, "../public", url.pathname), "utf8");
  };
  const spec = JSON.parse(readPublicLink(specLink));
  assert.match(spec.openapi, /^3\./);
  assert.ok(spec.servers.some((server) => new URL(server.url).origin === "https://embodystar.com"));
  assert.ok(spec.paths["/"].head.responses["200"]);
  const representations = spec.paths["/"].get.responses["200"].content;
  assert.equal(representations["text/markdown"].schema.type, "string");
  assert.equal(representations["text/html"].schema.type, "string");

  const response = proxy(new NextRequest(contentApi.anchor, { headers: { Accept: "text/markdown" } }));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/markdown/);
  assert.match(await response.text(), /^# EmbodyStar/);
  const docs = readPublicLink(docsLink);
  assert.match(docs, /Accept: text\/markdown/);
  assert.ok(docs.includes(contentApi.anchor));
});

test("proxy only matches the public homepage", () => {
  assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: "/" }), true);
  for (const url of ["/robots.txt", "/sitemap.xml", "/favicon.ico", "/.well-known/api-catalog", "/openapi.json", "/api-docs.md", "/_next/static/app.js", "/images/lerobot-arm.jpg", "/missing"]) {
    assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url }), false, url);
  }
});

test("robots rules explicitly allow search and training and publish consistent signals", () => {
  const robots = fs.readFileSync(path.resolve(__dirname, "../app/robots.txt"), "utf8");
  const groups = robots.trim().split(/\n\s*\n/).filter((group) => /^User-agent:/mi.test(group));
  const groupFor = (agent) => groups.find((group) => group.split("\n").some((line) => line.toLowerCase() === `user-agent: ${agent.toLowerCase()}`));
  for (const agent of ["*", "OAI-SearchBot", "Claude-SearchBot", "PerplexityBot"]) {
    assert.match(groupFor(agent), /^Allow: \/$/m);
    assert.doesNotMatch(groupFor(agent), /^Disallow: \/$/m);
  }
  for (const agent of ["GPTBot", "ClaudeBot", "Claude-Web", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider", "Amazonbot"]) {
    assert.match(groupFor(agent), /^Allow: \/$/m);
    assert.doesNotMatch(groupFor(agent), /^Disallow: \/$/m);
  }
  assert.equal(contentSignals, "ai-train=yes, search=yes, ai-input=yes");
  for (const group of groups) assert.ok(group.includes(`Content-Signal: ${contentSignals}`));
  assert.match(robots, /^Sitemap: https:\/\/embodystar\.com\/sitemap\.xml$/m);
});

test("sitemap lists the canonical public page once", () => {
  const entries = loadTypeScript("app/sitemap.ts").default();
  assert.deepEqual(entries.map((entry) => entry.url), ["https://embodystar.com/"]);
  const xml = resolveRouteData(entries, "sitemap");
  assert.match(xml, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
  assert.match(xml, /<url>\s*<loc>https:\/\/embodystar\.com\/<\/loc>\s*<\/url>/);
});
