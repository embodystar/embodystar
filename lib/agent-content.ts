import { formatPrice, products } from "./catalog";

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
    "# EmbodyStar | Robot Kits & Components",
    "",
    "Robot kits, components, and workbench tools.",
    "",
    "Desktop robotics and parts for your next build. This is a demo storefront with illustrative products, prices, and inventory. No real purchases or payments are processed.",
    "",
    "Canonical URL: https://embodystar.com/",
    "",
    "## The workbench collection",
    "",
    ...products.flatMap((product) => [
      `### ${product.name}`,
      "",
      product.description,
      "",
      `Category: ${product.category}. Demo price: ${formatPrice(product.price)} USD. Availability: ${product.stock ? `${product.stock} in demo inventory` : "Sold out"}.`,
      "",
      ...product.specs.map((spec) => `- ${spec}`),
      "",
    ]),
    "## Shopping bag and checkout",
    "",
    "Browse, search, sort, and save products in the browser. Your bag and saved products are stored on that device when browser storage is available.",
    "",
    "Demo shipping is $12 USD, or free for a demo subtotal of $150 USD or more. Demo checkout clears your bag and shows a confirmation; it does not charge money or create a real order.",
    "",
  ].join("\n");
}
