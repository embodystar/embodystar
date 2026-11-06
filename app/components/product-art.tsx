import Image from "next/image";
import { products, type ProductArt as Art } from "../../lib/catalog";

// The demo has no verified SKU photography. Reference images are labeled;
// the remaining products show their existing specifications instead of drawings.
export function ProductArt({ art, className = "" }: { art: Art; className?: string }) {
  const product = products.find((item) => item.art === art)!;
  const reference = art === "arm"
    ? { src: "/images/lerobot-arm.jpg", label: "LeRobot hardware reference" }
    : art === "controller"
      ? { src: "/images/shop/canoscan-5600f-main-pcb-top-view-1920.jpg", label: "Circuit board reference" }
      : art === "toolkit"
        ? { src: "/images/shop/2023-wkretak-elektryczny-xiaomi-1920.jpg", label: "Tool reference" }
        : null;
  return (
    <div className={`product-art ${reference ? "with-photo" : "with-spec"} ${className}`}>
      {reference ? <><Image src={reference.src} alt="" width={720} height={540} unoptimized /><span className="reference-caption">{reference.label}</span></> : <><span className="spec-primary">{product.specs[0]}</span><span className="spec-secondary">{product.specs[1]}</span><span className="spec-tertiary">{product.specs[2]}</span></>}
    </div>
  );
}
