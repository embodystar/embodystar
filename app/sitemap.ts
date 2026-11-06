import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep this list in sync with public page routes when publishing or removing them.
  // Product filters, detail dialogs, and the browser-local bag share the homepage URL.
  return [{ url: "https://embodystar.com/" }];
}
