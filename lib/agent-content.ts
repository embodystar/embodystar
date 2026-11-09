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
    "让智能，走进真实世界。", "", landing.description, "",
    "Canonical URL: https://embodystar.com/", "",
    "## 关于 EmbodyStar", "", landing.about, "",
    "我们关注从感知环境、理解任务，到执行动作并获得反馈的完整过程。以开放的视角，连接具身智能的概念、开源工具与实践路径。", "",
    "## 探索方向", "",
    ...explorationAreas.flatMap((area) => [`### ${area.title}`, "", area.description, "", area.keywords, ""]),
    "以上为项目关注的探索方向，具体进展请以项目仓库为准。", "",
    "## 在交互中理解，在反馈中学习", "",
    ...learningLoop.map((step, index) => `${index + 1}. ${step.title}：${step.description}`), "",
    "## 开源资源", "",
    ...resources.flatMap((resource) => [`### [${resource.title}](${resource.url})`, "", resource.description, ""]),
    "## 常见问题", "",
    ...faqs.flatMap((faq) => [`### ${faq.question}`, "", faq.answer, ""]),
    "机械臂参考影像来自 LeRobot / Hugging Face，遵循 Apache 2.0 许可证。", "",
  ].join("\n");
}
