# EmbodyStar shop

A responsive robotics shopping demo built with Next.js 16 and React 19. The storefront includes product search, category and new-arrival filters, price sorting, saved products, product detail dialogs, a persistent shopping bag, and a demo checkout.

## Development

```bash
pnpm dev
```

Open `http://localhost:3000`. Run `pnpm test` for the catalog, bag, sitemap, crawler-policy, and Markdown-negotiation checks, `pnpm lint` for ESLint, and `pnpm build` for the production build.

## Catalog and shopping bag

`lib/catalog.ts` is the shared source for the UI and agent-readable product catalog. Prices are integer USD cents. The eight products, their stock levels, specifications, and SVG illustrations are examples, not verified merchandise. Edit this source to add, update, or remove demo products. Product illustrations are in `app/components/product-art.tsx`; the hero photo retains the attribution in `public/images/ATTRIBUTION.md`.

The shopping bag and saved products persist in localStorage under `embodystar-shop-v1` when browser storage is available. Stored quantities are validated against the current catalog and stock limits. Demo shipping is $12, with free demo shipping for a subtotal of $150 or more.

Demo checkout reviews the bag, clears it on completion, and shows a confirmation. It does not collect payment details, charge money, submit an order, or reserve stock. Before selling real products, connect verified inventory, server-side price and stock validation, a payment provider, order persistence, taxes, and fulfillment. Authentication is not configured.

## Sitemap and crawler access

`app/sitemap.ts` generates `/sitemap.xml`. The homepage is currently the only public page URL; product filters, product detail dialogs, and the shopping bag share that URL. When publishing or removing a public page route, update its canonical HTTPS entry in the same deployment. If products gain dedicated page routes, generate sitemap entries from the same published catalog.

`app/robots.txt` allows general crawling and the listed AI search and training crawlers. Content Signals allow search, training, and AI input. Keep its directives aligned with the `Content-Signal` response header in `lib/agent-content.ts` when changing policy.

Requests to `/` that prefer `Accept: text/markdown` receive a Markdown catalog through `proxy.ts`; HTML remains the default. Markdown responses include `Vary: Accept` and `Cache-Control: no-store` to prevent caching Markdown under the HTML URL. If a CDN is configured to cache HTML, its cache key must also include `Accept` or bypass caching for Markdown requests. The UI and Markdown use the same published products from `lib/catalog.ts`, so edits and removals appear in both on deployment. Browser-local shopping bags and saved items are excluded. When adding another public page, extend Markdown handling and the proxy matcher alongside its sitemap entry.

If Cloudflare manages robots.txt or transforms responses, keep its AI Crawl Control settings aligned with this policy. After deployment, validate with:

```bash
curl -X POST https://isitagentready.com/api/scan \
  -H 'Content-Type: application/json' \
  --data '{"url":"https://embodystar.com"}'
```

Check robots.txt, sitemap, AI bot rules, Content Signals, and Markdown negotiation in the response.
