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
const { products, restoreCart, updateCart, cartTotals } = loadTypeScript("lib/catalog.ts");
const { contentSignals, prefersMarkdown } = loadTypeScript("lib/agent-content.ts");

test("negotiation respects quality values and keeps HTML as the default", () => {
  for (const accept of [null, "*/*", "text/html", "text/markdown;q=0", "text/markdown;q=invalid", "text/markdown;q=0.2, text/html;q=0.9", "text/markdown;q=0, */*;q=1"]) {
    assert.equal(prefersMarkdown(accept), false, String(accept));
  }
  for (const accept of ["text/markdown", "TEXT/MARKDOWN; charset=utf-8", "text/markdown, text/html", "text/markdown;q=0.9, text/html;q=0.2", "text/markdown;q=0.5, text/html;q=0, */*;q=1"]) {
    assert.equal(prefersMarkdown(accept), true, accept);
  }
});

test("Markdown requests receive the current product catalog and policy", async () => {
  const response = proxy(new NextRequest("https://embodystar.com/", { headers: { Accept: "text/markdown" } }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.equal(response.headers.get("vary"), "Accept");
  assert.equal(response.headers.get("content-signal"), contentSignals);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = await response.text();
  assert.match(body, /^# EmbodyStar/);
  assert.doesNotMatch(body, /<script|<style|<div/);
  for (const product of products) {
    assert.ok(body.includes(`### ${product.name}`));
    assert.ok(body.includes(product.description));
  }
  assert.match(body, /No real purchases or payments/);
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

test("proxy only matches the public homepage", () => {
  assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: "/" }), true);
  for (const url of ["/robots.txt", "/sitemap.xml", "/favicon.ico", "/_next/static/app.js", "/images/lerobot-arm.jpg", "/missing"]) {
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

test("stored bags reject malformed data and use the current inventory limits", () => {
  assert.deepEqual(restoreCart(null), []);
  assert.deepEqual(restoreCart({ productId: "orbit-arm", quantity: 1 }), []);
  assert.deepEqual(restoreCart([null, {}, { productId: "missing", quantity: 2 }, { productId: "orbit-arm", quantity: 1.5 }, { productId: "orbit-arm", quantity: "2" }, { productId: "distance-sensor", quantity: 1 }]), []);
  assert.deepEqual(restoreCart([{ productId: "orbit-arm", quantity: 999 }, { productId: "precision-servo", quantity: 2 }]), [{ productId: "orbit-arm", quantity: 12 }, { productId: "precision-servo", quantity: 2 }]);
});

test("bag updates cap quantities, combine repeated additions, and remove items at zero", () => {
  const bag = updateCart([], "vision-camera", 2);
  assert.equal(bag.length, 1);
  assert.deepEqual(updateCart(bag, "vision-camera", 3), [{ productId: "vision-camera", quantity: 3 }]);
  assert.deepEqual(updateCart(bag, "vision-camera", 0), []);
  assert.deepEqual(updateCart(bag, "vision-camera", -1), []);
  assert.deepEqual(updateCart(bag, "vision-camera", Number.NaN), bag);
  assert.deepEqual(updateCart([], "distance-sensor", 3), []);
  assert.equal(updateCart(bag, "vision-camera", 100)[0].quantity, 24);
});

test("demo totals use integer cents and apply the shipping threshold", () => {
  assert.deepEqual(cartTotals([]), { subtotal: 0, shipping: 0, total: 0 });
  assert.deepEqual(cartTotals([{ productId: "vision-camera", quantity: 2 }]), { subtotal: 11800, shipping: 1200, total: 13000 });
  assert.deepEqual(cartTotals([{ productId: "precision-servo", quantity: 1 }, { productId: "vision-camera", quantity: 2 }]), { subtotal: 14700, shipping: 1200, total: 15900 });
  assert.deepEqual(cartTotals([{ productId: "vision-camera", quantity: 2 }, { productId: "motion-controller", quantity: 1 }]), { subtotal: 15700, shipping: 0, total: 15700 });
  assert.deepEqual(cartTotals([{ productId: "orbit-arm", quantity: 1 }]), { subtotal: 24900, shipping: 0, total: 24900 });
});
