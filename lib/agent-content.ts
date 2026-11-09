import { explorationAreas, faqs, landing, learningLoop, resources } from "./landing";

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
    `# ${landing.title}`, "",
    "Intelligence, in the real world.", "", landing.description, "",
    "Canonical URL: https://embodystar.com/", "",
    "## About EmbodyStar", "", landing.about, "", landing.approach, "",
    "## Exploration", "",
    ...explorationAreas.flatMap((area) => [`### ${area.title}`, "", area.description, "", area.keywords, ""]),
    landing.focusNote, "",
    "## Understand through action. Learn through feedback.", "",
    ...learningLoop.map((step, index) => `${index + 1}. ${step.title}: ${step.description}`), "",
    "## Open-source resources", "",
    ...resources.flatMap((resource) => [`### [${resource.title}](${resource.url})`, "", resource.description, ""]),
    "## Frequently asked questions", "",
    ...faqs.flatMap((faq) => [`### ${faq.question}`, "", faq.answer, ""]),
    "Robot arm reference imagery: LeRobot / Hugging Face, licensed under Apache 2.0.", "",
  ].join("\n");
}
