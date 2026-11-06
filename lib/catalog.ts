export type Category = "Robot kits" | "Components" | "Accessories";
export type ProductArt = "arm" | "rover" | "camera" | "controller" | "gripper" | "motor" | "toolkit" | "sensor";

export type Product = {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  stock: number;
  art: ProductArt;
  color: string;
  badge?: string;
  isNew?: boolean;
  specs: string[];
};

// Illustrative products and USD prices for this demo storefront, in cents.
// Replace this catalog with verified inventory before enabling real purchases.
export const products: Product[] = [
  { id: "orbit-arm", name: "Orbit desktop arm", category: "Robot kits", description: "Your first step from code to motion. A compact robotic arm for exploring pick-and-place, creative coding, and everyday experiments.", price: 24900, stock: 12, art: "arm", color: "#dce4da", badge: "The starting point", specs: ["5 degrees of freedom", "USB-C connection", "Assembly guide included", "Recommended for ages 16+"] },
  { id: "scout-rover", name: "Scout rover kit", category: "Robot kits", description: "A little platform for big ideas. Build a rolling companion and explore navigation, obstacle avoidance, and autonomous movement.", price: 18900, stock: 8, art: "rover", color: "#e9e4d9", badge: "Just landed", isNew: true, specs: ["Four-wheel chassis", "Rechargeable battery", "Modular mounting deck", "Beginner-friendly assembly"] },
  { id: "vision-camera", name: "Vision camera module", category: "Components", description: "Give your next build a new perspective. A compact camera module designed for computer vision experiments on the workbench.", price: 5900, stock: 24, art: "camera", color: "#dee5e6", specs: ["1080p image capture", "USB connection", "Adjustable mounting bracket", "For indoor experiments"] },
  { id: "motion-controller", name: "Motion control board", category: "Components", description: "The small but mighty center of your build. Bring sensors, motors, and your next idea together on one easy-to-use board.", price: 3900, stock: 18, art: "controller", color: "#e7dfd4", badge: "Maker essential", specs: ["6 servo channels", "USB-C programming", "Labeled connection pins", "Compact 65 × 45 mm footprint"] },
  { id: "soft-gripper", name: "Soft-touch gripper", category: "Accessories", description: "A gentler way to get a grip. Flexible fingertips help you experiment with picking up objects of different shapes and sizes.", price: 4500, stock: 15, art: "gripper", color: "#e7ddd6", isNew: true, specs: ["Flexible silicone tips", "Servo-actuated design", "60 mm opening", "Mounting screws included"] },
  { id: "precision-servo", name: "Precision servo duo", category: "Components", description: "Two dependable little movers. Add controlled, repeatable motion to your next mechanism, prototype, or weekend project.", price: 2900, stock: 30, art: "motor", color: "#e2e4d8", specs: ["Set of two servos", "180° positioning", "Metal output shaft", "Mounting horns included"] },
  { id: "bench-toolkit", name: "The workbench toolkit", category: "Accessories", description: "A thoughtfully chosen set of tools for the moments between an idea and a working prototype. Everything has its place.", price: 6900, stock: 10, art: "toolkit", color: "#e6ded2", specs: ["12 precision bits", "Aluminum driver", "Fine-tip tweezers", "Reusable storage case"] },
  { id: "distance-sensor", name: "Distance sensor pack", category: "Components", description: "Help your robot find its way. A pair of compact distance sensors for exploring proximity, presence, and obstacle detection.", price: 2400, stock: 0, art: "sensor", color: "#dce3df", badge: "Back soon", specs: ["Pack of two modules", "Ultrasonic sensing", "Labeled header pins", "Breadboard compatible"] },
];

export const categories: Category[] = ["Robot kits", "Components", "Accessories"];

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: cents % 100 === 0 ? 0 : 2 }).format(cents / 100);
}

export type CartItem = { productId: string; quantity: number };

export function updateCart(cart: CartItem[], productId: string, quantity: number): CartItem[] {
  const product = products.find((item) => item.id === productId);
  if (!product || !Number.isSafeInteger(quantity)) return cart;
  const nextQuantity = Math.min(product.stock, Math.max(0, quantity));
  if (!nextQuantity) return cart.filter((item) => item.productId !== productId);
  if (cart.some((item) => item.productId === productId)) {
    return cart.map((item) => item.productId === productId ? { productId, quantity: nextQuantity } : item);
  }
  return [...cart, { productId, quantity: nextQuantity }];
}

export function restoreCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<CartItem[]>((cart, item: unknown) => {
    if (!item || typeof item !== "object" || !("productId" in item) || !("quantity" in item) || typeof item.productId !== "string" || typeof item.quantity !== "number") return cart;
    return updateCart(cart, item.productId, item.quantity);
  }, []);
}

export function cartTotals(cart: CartItem[]) {
  const subtotal = cart.reduce((total, item) => total + (products.find((product) => product.id === item.productId)?.price ?? 0) * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 15000 ? 0 : 1200;
  return { subtotal, shipping, total: subtotal + shipping };
}
