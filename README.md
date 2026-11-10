# EmbodyStar

An English landing page about embodied intelligence, built with Next.js 16 and React 19. A dark laboratory-inspired visual system pairs a procedural robot visualization with an interactive architecture explorer, open-source resources, and accessible FAQ disclosures.

## Development

Run `pnpm dev` to preview at `http://localhost:3000`, `pnpm test` for content negotiation, API catalog, A2A, crawler-policy, and sitemap checks, and `pnpm build` for a production build.

## Content

`lib/landing.ts` contains the project description, exploration areas, architecture examples, learning loop, resource links, and FAQs. The page and agent-readable Markdown share this content. Primary actions lead to the architecture and open-source resources. The field image is an attributed LeRobot reference; the source and license are in `public/images/ATTRIBUTION.md` and `public/images/LEROBOT-LICENSE.txt`.

## Interactive studies

`app/components/robot-scene.tsx` renders a procedural robot arm with Canvas 2D and perspective projection. `lib/robot-geometry.ts` defines the arm segments, cylindrical surface samples, and forward kinematics. Shoulder and elbow sliders update the pose and computed end-effector coordinates in arbitrary model units. Visitors can switch between point-cloud and wireframe views, pause rotation, or reset the joints. This is a conceptual visualization with no hardware connection or physical collision simulation.

Rendering is capped at approximately 30 frames per second and a device pixel ratio of 1.5. It suspends while the scene is outside the viewport or the page is hidden, and starts with rotation paused when reduced motion is requested. Pointer movement adjusts the camera view. Geometry and controls remain local to the browser, with no additional runtime dependencies.

`app/components/architecture-explorer.tsx` provides keyboard-accessible perception, action, and learning tabs. Each shows an illustrative JSON data structure and its input/output relationship. These examples explain concepts rather than claim implemented robotics capabilities.

The site has no commerce flow, cart, checkout, or browser persistence. Exploration areas describe the project's focus; implemented capabilities and progress are established by the linked project repository.

## Crawler access

`app/sitemap.ts` lists the canonical homepage. `app/robots.txt` allows crawling and the listed AI search and training crawlers. Keep its Content Signals aligned with `lib/agent-content.ts`.

Requests to `/` preferring `Accept: text/markdown` receive a Markdown version through `proxy.ts`; HTML remains the default. Markdown responses include `Vary: Accept` and `Cache-Control: no-store`. Any CDN caching HTML must include `Accept` in the cache key or bypass caching for Markdown requests. When adding another public route, update its sitemap entry, Markdown handling, and proxy matcher together.

## API discovery

`/.well-known/api-catalog` serves an RFC 9727 Linkset describing the read-only Markdown content interface at `/` and the A2A interface at `/api/a2a`. It supports `GET` and `HEAD`, returns `application/linkset+json` with the RFC profile, and advertises its canonical URL through a `Link` header. Homepage responses advertise the same catalog.

`lib/api-catalog.ts` lists the public interfaces. Each entry links to its OpenAPI specification and usage documentation: `public/openapi.json` and `public/api-docs.md` for the Markdown interface, and the corresponding `a2a-` files for the agent. Keep these resources synchronized with the actual endpoints when adding or changing an API. The conceptual robotics examples are not API endpoints, and no health endpoint is advertised.

After deployment, validate the public catalog:

```sh
curl --fail --request POST https://isitagentready.com/api/scan \
  --header 'Content-Type: application/json' \
  --data '{"url":"https://embodystar.com"}'
```

Confirm that `checks.discovery.apiCatalog.status` is `"pass"`.

## A2A discovery

`/.well-known/agent-card.json` publishes the EmbodyStar Content Agent's identity, A2A 1.0 JSON-RPC interface, supported media types, and `get-public-content` skill. The card supports conditional `GET` and `HEAD` requests with an ETag and a five-minute cache lifetime. Bump the card version in `lib/agent-card.ts` when its metadata or advertised behavior changes.

`POST /api/a2a` handles `SendMessage` by returning the existing public Markdown overview as a direct A2A message. It is stateless, makes no external model calls, and exposes no robot-control capability. Streaming, push notifications, and extended agent cards are disabled. The endpoint limits request bodies to 64 KiB and returns protocol errors for invalid or unsupported requests.

The API catalog also lists this interface, with `public/a2a-openapi.json` and `public/a2a-docs.md` describing the service. These Next.js Route Handlers deploy through the existing Cloudflare Workers build; no separate Agents SDK service or Durable Object binding is required for this synchronous content adapter.

Run `pnpm test` for Agent Card and service contract checks. After publishing, use the scan command above and confirm `checks.discovery.a2aAgentCard.status` is `"pass"`.
