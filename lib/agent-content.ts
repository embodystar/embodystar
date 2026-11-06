import { resources } from "./resources";

export const contentSignals = "ai-train=yes, search=yes, ai-input=yes";

// Wildcards alone keep the browser default. An explicit Markdown preference
// must have a positive quality at least as high as the HTML alternative.
export function prefersMarkdown(accept: string | null): boolean {
  const ranges = (accept ?? "").toLowerCase().split(",").map((range) => {
    const [type, ...parameters] = range.trim().split(";");
    const quality = parameters.find((parameter) => parameter.trim().startsWith("q="));
    const value = quality ? Number(quality.trim().slice(2)) : 1;
    return { type: type.trim(), quality: Number.isFinite(value) && value >= 0 && value <= 1 ? value : 0 };
  });
  const markdown = ranges.find((range) => range.type === "text/markdown");
  const html = ["text/html", "text/*", "*/*"]
    .map((type) => ranges.find((range) => range.type === type))
    .find((range) => range !== undefined);
  return Boolean(markdown && markdown.quality > 0 && markdown.quality >= (html?.quality ?? 0));
}

export function homepageMarkdown(): string {
  return [
    "# EmbodyStar — The Embodied AI Hub",
    "",
    "Discover embodied intelligence.",
    "",
    "The ideas, models, and tools bringing intelligence into the real world.",
    "",
    "Canonical URL: https://embodystar.com/",
    "",
    "## Featured resource: LeRobot",
    "",
    "Open models, datasets, and tools to take your next robotics project further. From the open-source community at Hugging Face.",
    "",
    "## Resource index",
    "",
    ...resources.flatMap((resource) => [
      `### [${resource.title}](${resource.url})`,
      "",
      resource.description,
      "",
      `Category: ${resource.kind}. Maintainer: ${resource.org}. Tags: ${resource.tags.join(", ")}.`,
      "",
    ]),
    "## Your reference shelf",
    "",
    "Search and filter the index, bookmark resources, or add your own resource in the browser. Bookmarks and additions stay on that device.",
    "",
    "[Explore the embodied AI community on GitHub](https://github.com/topics/embodied-ai)",
    "",
  ].join("\n");
}
