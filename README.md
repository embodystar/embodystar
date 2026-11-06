This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Sitemap maintenance

`app/sitemap.ts` generates `/sitemap.xml`. The homepage is currently the only public page URL; resource filters, dialogs, and browser-local collections do not have separate URLs.

When publishing or removing a public page route, add or remove its canonical HTTPS URL in `app/sitemap.ts` in the same deployment. If public content gains its own routes and a shared data source, generate those entries from the published content in that source so unpublished or deleted content is excluded. Keep the sitemap reference in `app/robots.txt` aligned with the production domain.

## AI crawler policy and Markdown

`app/robots.txt` allows general crawling and the listed AI search and training crawlers (including the legacy Claude-Web identifier). Content Signals allow search, training, and AI input. Keep these directives aligned with the `Content-Signal` response header in `lib/agent-content.ts` when changing the policy.

Requests to `/` that prefer `Accept: text/markdown` receive a Markdown resource index through `proxy.ts`. HTML remains the default. Both responses vary on `Accept`; Markdown responses use `Cache-Control: no-store` to prevent a CDN from caching Markdown under the homepage's HTML URL. The UI and Markdown use the same published resources from `lib/resources.ts`, so edits and removals appear in both on deployment. Browser-local additions and bookmarks remain private to that browser. When adding a new public page, extend Markdown handling and the proxy matcher alongside its sitemap entry.

If Cloudflare manages robots.txt or transforms responses, keep its AI Crawl Control settings aligned with this policy. After deployment, scan `https://embodystar.com` using `POST https://isitagentready.com/api/scan` with `{"url":"https://embodystar.com"}` and verify `robotsTxt`, `sitemap`, AI bot rules, Content Signals, and Markdown negotiation all pass.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
