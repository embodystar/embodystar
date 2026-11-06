import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep this list in sync with public page routes when publishing or removing them.
  // Resource filters, dialogs, and browser-local collections share the homepage URL.
  return [{ url: "https://embodystar.com/" }];
}
