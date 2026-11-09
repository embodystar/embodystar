# EmbodyStar

An English landing page about embodied intelligence, built with Next.js 16 and React 19. It introduces perception, action, and learning, with a project overview, an illustrative learning loop, open-source resources, and accessible FAQ disclosures.

## Development

Run `pnpm dev` to preview at `http://localhost:3000`, `pnpm test` for content negotiation, crawler-policy, and sitemap checks, and `pnpm build` for a production build.

## Content

`lib/landing.ts` contains the project description, exploration areas, learning loop, resource links, and FAQs. The page and agent-readable Markdown share this content. Primary actions lead to the project introduction and open-source resources. The imagery is an attributed LeRobot reference, not an EmbodyStar product; the source and license are in `public/images/ATTRIBUTION.md` and `public/images/LEROBOT-LICENSE.txt`.

The site has no commerce flow, cart, checkout, or browser persistence. Exploration areas describe the project's focus; implemented capabilities and progress are established by the linked project repository.

## Crawler access

`app/sitemap.ts` lists the canonical homepage. `app/robots.txt` allows crawling and the listed AI search and training crawlers. Keep its Content Signals aligned with `lib/agent-content.ts`.

Requests to `/` preferring `Accept: text/markdown` receive a Markdown version through `proxy.ts`; HTML remains the default. Markdown responses include `Vary: Accept` and `Cache-Control: no-store`. Any CDN caching HTML must include `Accept` in the cache key or bypass caching for Markdown requests. When adding another public route, update its sitemap entry, Markdown handling, and proxy matcher together.
