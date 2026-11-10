import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep this list in sync with public page routes when publishing or removing them.
  return [{ url: "https://embodystar.com/" }];
}
