"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ProductArt } from "./components/product-art";
import { cartTotals, categories, formatPrice, products, restoreCart, updateCart, type CartItem, type Category, type Product } from "../lib/catalog";

type View = "product" | "cart" | "checkout" | "confirmation" | "about" | null;
type Sort = "Featured" | "Price: low to high" | "Price: high to low" | "Name: A to Z";
const STORAGE_KEY = "embodystar-shop-v1";

function Icon({ name, size = 20 }: { name: "search" | "bag" | "arrow" | "heart" | "close" | "plus" | "minus" | "check" | "package" | "spark"; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === "search" ? <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></> : name === "bag" ? <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></> : name === "arrow" ? <path d="M4 12h16m-6-6 6 6-6 6" /> : name === "heart" ? <path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-3 3 0 7 2 9l6 6 6-6c2-2 5-6 2-9Z" /> : name === "close" ? <path d="m6 6 12 12M6 18 18 6" /> : name === "plus" ? <path d="M12 5v14M5 12h14" /> : name === "minus" ? <path d="M5 12h14" /> : name === "check" ? <path d="m5 12 4 4L19 6" /> : name === "package" ? <><path d="m3 7 9-4 9 4v11l-9 4-9-4V7Zm0 0 9 4 9-4m-9 4v11M7.5 5l9 4v4" /></> : <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" />}</svg>;
}

export default function Home() {
  const [category, setCategory] = useState<Category | "All products">("All products");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("Featured");
  const [newOnly, setNewOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>(null);
  const [selected, setSelected] = useState<Product>(products[0]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const [storageNotice, setStorageNotice] = useState("");
  const [receiptTotal, setReceiptTotal] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
        if (data && typeof data === "object") {
          if ("cart" in data) setCart(restoreCart(data.cart));
          if ("saved" in data && Array.isArray(data.saved)) setSaved(data.saved.filter((id): id is string => typeof id === "string" && products.some((product) => product.id === id)));
        }
      } catch { setStorageNotice("Browser storage is unavailable. Your bag will stay for this visit."); }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, saved })); }
    catch { /* The current session remains usable when browser storage is unavailable. */ }
  }, [cart, saved, ready]);

  useEffect(() => {
    if (view) {
      dialog.current?.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = previous; };
    }
    dialog.current?.close();
  }, [view]);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timeout);
  }, [notice]);

  const totals = cartTotals(cart);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const visible = products.filter((product) =>
    (category === "All products" || product.category === category) &&
    (!newOnly || product.isNew) && (!savedOnly || saved.includes(product.id)) &&
    `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => sort === "Price: low to high" ? a.price - b.price : sort === "Price: high to low" ? b.price - a.price : sort === "Name: A to Z" ? a.name.localeCompare(b.name) : 0);
  const cartProducts = cart.flatMap((item) => {
    const product = products.find((product) => product.id === item.productId);
    return product ? [{ ...item, product }] : [];
  });

  function shop(nextCategory: Category | "All products" = "All products", arrivals = false) {
    setCategory(nextCategory); setNewOnly(arrivals); setSavedOnly(false); setQuery("");
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }
  function openProduct(product: Product) { setSelected(product); setProductQuantity(1); setView("product"); }
  function toggleSaved(id: string) { setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  function addToCart(product: Product, quantity = 1) {
    const current = cart.find((item) => item.productId === product.id)?.quantity ?? 0;
    if (current >= product.stock) { setNotice(`All ${product.stock} available ${product.name} units are already in your bag.`); return; }
    setCart((items) => updateCart(items, product.id, (items.find((item) => item.productId === product.id)?.quantity ?? 0) + quantity));
    setNotice(`${product.name} added to your bag.`);
  }
  function finishDemoOrder() {
    if (!cart.length) return;
    setReceiptTotal(totals.total); setCart([]); setView("confirmation");
  }

  return (
    <div className="storefront">
      <a className="skip-link" href="#shop">Skip to products</a>
      <div className="announcement"><span>Robot kits, components & accessories</span><span className="demo-label">Demo storefront in USD</span></div>
      <header className="store-header">
        <a href="#" className="store-brand" aria-label="EmbodyStar home" onClick={() => { setCategory("All products"); setNewOnly(false); setSavedOnly(false); setQuery(""); }}><Icon name="spark" size={32} /><span>embody<span className="brand-light">star</span></span></a>
        <nav className="main-nav" aria-label="Main navigation"><button type="button" onClick={() => shop()}>Shop all</button><button type="button" onClick={() => shop("Robot kits")}>Robot kits</button><button type="button" onClick={() => shop("Components")}>Components</button><button type="button" onClick={() => shop("All products", true)}>New arrivals</button></nav>
        <div className="header-actions"><button type="button" className="icon-button" aria-label="Search products" onClick={() => { document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); searchInput.current?.focus({ preventScroll: true }); }}><Icon name="search" /></button><button type="button" className={`icon-button favorites-button ${savedOnly ? "selected" : ""}`} aria-label={`Show saved products (${saved.length})`} aria-pressed={savedOnly} onClick={() => { setSavedOnly(!savedOnly); setCategory("All products"); setNewOnly(false); setQuery(""); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}><Icon name="heart" /></button><button type="button" className="bag-button" aria-label={`Open shopping bag, ${itemCount} items`} onClick={() => setView("cart")}><Icon name="bag" /><span className="bag-label">Bag</span><span className="bag-count">{itemCount}</span></button></div>
      </header>
      <main>
        <section className="shop-hero" aria-labelledby="hero-title">
          <div className="hero-copy"><h1 id="hero-title">Robotics for<br /> the workbench.</h1><p>Desktop robotics and parts for your next build.</p><button type="button" className="button button-dark" onClick={() => shop()}>Shop all products</button></div>

        </section>

        <section id="shop" className="shop-section" aria-labelledby="shop-title">
          <div className="section-heading"><h2 id="shop-title">{savedOnly ? "Saved products" : newOnly ? "New arrivals" : "The catalog"}</h2><p>Compare specifications. Choose a part.</p></div>
          <div className="shop-toolbar"><div className="category-tabs" aria-label="Product categories">{(["All products", ...categories] as const).map((item) => <button type="button" key={item} className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => { setCategory(item); setNewOnly(false); }}>{item}{item === "All products" && <span>{products.length}</span>}</button>)}</div><label className="sort-control"><span>Sort by:</span><select value={sort} onChange={(event) => setSort(event.target.value as Sort)} aria-label="Sort products"><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option><option>Name: A to Z</option></select></label></div>
          <div className="search-row"><label className="product-search"><Icon name="search" size={17} /><input ref={searchInput} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products or components" aria-label="Search products" />{query && <button type="button" className="icon-button" aria-label="Clear search" onClick={() => setQuery("")}><Icon name="close" size={15} /></button>}</label><span className="result-count" aria-live="polite">{visible.length} {visible.length === 1 ? "product" : "products"}{savedOnly ? " saved" : ""}</span>{(newOnly || savedOnly) && <button type="button" className="text-link" onClick={() => { setNewOnly(false); setSavedOnly(false); }}>Clear {newOnly ? "new arrivals" : "saved filter"}<Icon name="close" size={13} /></button>}</div>
          {visible.length ? <div className={`catalog-layout ${category === "All products" && !query && !savedOnly && !newOnly ? "has-feature" : ""}`}>{category === "All products" && !query && !savedOnly && !newOnly && <aside className="catalog-feature"><div className="hero-visual"><div className="hero-photo-frame"><Image src="/images/lerobot-arm.jpg" alt="Turquoise LeRobot arms on a workbench, shown as a hardware reference" width={960} height={700} unoptimized preload /></div><div className="hero-image-card"><div><h2>Orbit desktop arm</h2><p>5 degrees of freedom. USB-C connection.</p><p className="hero-reference">Photo: LeRobot hardware reference.</p><span>{formatPrice(products[0].price)} <small>Demo price</small></span></div><button type="button" className="button button-dark" aria-label="Shop robot kits" onClick={() => shop("Robot kits")}>Shop kits</button></div></div></aside>}<div className="product-grid">{visible.map((product) => <article className="product-card" key={product.id}><div className="product-image"><button type="button" className="product-preview" onClick={() => openProduct(product)} aria-label={`View ${product.name}`}><ProductArt art={product.art} /></button><button type="button" className={`save-button ${saved.includes(product.id) ? "is-saved" : ""}`} disabled={!ready} aria-label={`${saved.includes(product.id) ? "Unsave" : "Save"} ${product.name}`} aria-pressed={saved.includes(product.id)} onClick={() => toggleSaved(product.id)}><Icon name="heart" size={18} /></button><button type="button" className="quick-add" disabled={!ready || !product.stock} aria-label={`Add ${product.name} to bag`} onClick={() => addToCart(product)}>{product.stock ? <><Icon name="plus" size={16} /><span>Add to bag</span></> : "Sold out"}</button></div><div className="product-info"><div><button type="button" className="product-name" onClick={() => openProduct(product)}><h3>{product.name}</h3></button><span className="product-price">{formatPrice(product.price)}</span></div><p className="product-category">{product.category}</p><ul className="product-specs">{product.specs.slice(0, 2).map((spec) => <li key={spec}>{spec}</li>)}</ul></div></article>)}</div></div> : <div className="empty-products"><Icon name={savedOnly ? "heart" : "search"} size={32} /><h3>{savedOnly ? "No saved products" : "No matching products"}</h3><p>{savedOnly ? "Tap the heart on a product to keep it here for later." : "Try another search or explore the whole collection."}</p><button type="button" className="button button-dark" onClick={() => shop()}>Explore all products</button></div>}
        </section>
        <aside className="maker-banner"><div><h2>About EmbodyStar</h2><p>A demo shop for robot kits, components and workbench tools.</p></div><button type="button" className="button button-outline" onClick={() => setView("about")}>About the shop</button></aside>
      </main>
      <footer className="store-footer"><div><a className="store-brand footer-brand" href="#"><Icon name="spark" size={28} /><span>embody<span className="brand-light">star</span></span></a><p>Robot kits & components.</p></div><div className="footer-links"><button type="button" onClick={() => shop()}>Shop the collection</button><button type="button" onClick={() => setView("about")}>About EmbodyStar</button><a href="https://github.com/huggingface/lerobot" target="_blank" rel="noreferrer">LeRobot image credits</a></div><div className="footer-note"><span>EmbodyStar demo shop</span><small>Demo store. Illustrative products and prices.<br />No real purchases or payments.</small></div><p className="photo-credits" data-credits>Hardware reference photographs: <a href="https://commons.wikimedia.org/wiki/File:CanoScan_5600F_main_PCB_top_view.jpg">Mister rf</a> and <a href="https://commons.wikimedia.org/wiki/File:2023_Wkr%C4%99tak_elektryczny_Xiaomi.jpg">Jacek Halicki</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Photos show reference hardware, not the demo products.</p></footer>
      {notice && <div className="toast" role="status"><Icon name="check" size={18} /><span>{notice}</span><button type="button" onClick={() => { setView("cart"); setNotice(""); }}>View bag</button><button type="button" className="icon-button" aria-label="Dismiss notification" onClick={() => setNotice("")}><Icon name="close" size={15} /></button></div>}
      <dialog ref={dialog} className={`shop-dialog ${view === "cart" || view === "checkout" ? "bag-dialog" : ""}`} onCancel={() => setView(null)} onClose={() => setView(null)} onClick={(event) => { if (event.target === event.currentTarget) setView(null); }} aria-labelledby="dialog-title"><div className="dialog-inner"><button type="button" className="dialog-close icon-button" aria-label="Close dialog" onClick={() => setView(null)}><Icon name="close" /></button>
        {view === "product" && <div className="product-detail"><div className="detail-image"><ProductArt art={selected.art} /></div><div className="detail-copy"><h2 id="dialog-title">{selected.name}</h2><span className="detail-price">{formatPrice(selected.price)} <small>USD, demo price</small></span><p>{selected.description}</p><ul className="spec-list">{selected.specs.map((spec) => <li key={spec}><Icon name="check" size={16} />{spec}</li>)}</ul><span className={`stock-label ${!selected.stock ? "unavailable" : ""}`}><span />{selected.stock ? `${selected.stock} available in demo inventory` : "Currently sold out"}</span>{selected.stock > 0 && <div className="detail-purchase"><div className="quantity-control"><button type="button" disabled={productQuantity <= 1} aria-label="Decrease quantity" onClick={() => setProductQuantity((value) => Math.max(1, value - 1))}><Icon name="minus" size={15} /></button><output aria-label="Quantity">{productQuantity}</output><button type="button" disabled={productQuantity >= selected.stock} aria-label="Increase quantity" onClick={() => setProductQuantity((value) => Math.min(selected.stock, value + 1))}><Icon name="plus" size={15} /></button></div><button type="button" className="button button-dark" disabled={!ready || (cart.find((item) => item.productId === selected.id)?.quantity ?? 0) >= selected.stock} onClick={() => { addToCart(selected, productQuantity); setView("cart"); }}>Add to bag<Icon name="bag" size={18} /></button></div>}<button type="button" className="detail-save text-link" disabled={!ready} onClick={() => toggleSaved(selected.id)}><Icon name="heart" size={17} />{saved.includes(selected.id) ? "Saved product" : "Save for later"}</button><small className="demo-hint">This is a demo product. No purchase will be made.</small></div></div>}
        {(view === "cart" || view === "checkout") && <div className="bag-content"><h2 id="dialog-title">{view === "checkout" ? "Review demo order" : "Your shopping bag"}</h2><p className="bag-item-count">{itemCount} {itemCount === 1 ? "item" : "items"}</p>{cartProducts.length ? <><p className="bag-intro">{view === "checkout" ? "Review your demo order. No payment details needed." : "Your selected products and quantities."}</p><div className="shipping-note"><Icon name="package" size={19} /><div>{totals.subtotal >= 15000 ? "Your demo bag qualifies for free shipping." : `Add ${formatPrice(15000 - totals.subtotal)} for free demo shipping.`}<div className="shipping-progress"><span style={{ transform: `scaleX(${Math.min(1, totals.subtotal / 15000)})` }} /></div></div></div><div className="cart-items">{cartProducts.map(({ product, quantity }) => <div className="cart-item" key={product.id}><div className="cart-item-image"><ProductArt art={product.art} /></div><div className="cart-item-info"><span className="product-category">{product.category}</span><h3>{product.name}</h3><span>{formatPrice(product.price)}</span><div className="quantity-control"><button type="button" aria-label={`Decrease ${product.name} quantity`} onClick={() => setCart((items) => updateCart(items, product.id, quantity - 1))}><Icon name="minus" size={13} /></button><output aria-label={`${product.name} quantity`}>{quantity}</output><button type="button" disabled={quantity >= product.stock} aria-label={`Increase ${product.name} quantity`} onClick={() => setCart((items) => updateCart(items, product.id, quantity + 1))}><Icon name="plus" size={13} /></button></div></div><div className="cart-item-end"><button type="button" className="icon-button" aria-label={`Remove ${product.name}`} onClick={() => setCart((items) => updateCart(items, product.id, 0))}><Icon name="close" size={16} /></button><strong>{formatPrice(product.price * quantity)}</strong></div></div>)}</div><div className="bag-totals"><div><span>Subtotal</span><span>{formatPrice(totals.subtotal)}</span></div><div><span>Demo shipping</span><span>{totals.shipping ? formatPrice(totals.shipping) : "Free"}</span></div><div className="total-row"><strong>Total</strong><strong>{formatPrice(totals.total)} <small>USD</small></strong></div></div>{view === "checkout" ? <><div className="demo-checkout-note"><Icon name="check" size={20} /><p>This is a demo checkout. Completing it clears your bag and shows a confirmation. No real order is placed and no payment is collected.</p></div><button type="button" className="button button-dark checkout-button" onClick={finishDemoOrder}>Complete demo order</button><button type="button" className="text-link continue-shopping" onClick={() => setView("cart")}>Back to bag</button></> : <><button type="button" className="button button-dark checkout-button" onClick={() => setView("checkout")}>Review demo order</button><p className="checkout-footnote">Demo checkout. No payment required.</p><button type="button" className="text-link continue-shopping" onClick={() => setView(null)}>Continue exploring</button></>}</> : <div className="empty-bag"><Icon name="bag" size={48} /><h3>Your bag is empty</h3><p>Add a robot kit or component to start a demo order.</p><button type="button" className="button button-dark" onClick={() => { setView(null); shop(); }}>Explore the collection</button></div>}{storageNotice && <p className="storage-notice">{storageNotice}</p>}</div>}
        {view === "confirmation" && <div className="confirmation"><div className="confirmation-icon"><Icon name="check" size={32} /></div><h2 id="dialog-title">Demo order complete</h2><p>You completed a demo order for <strong>{formatPrice(receiptTotal)}</strong>.</p><p>No money was charged and no order was placed.<br />Your shopping bag has been cleared.</p><button type="button" className="button button-dark" onClick={() => { setView(null); shop(); }}>Keep exploring</button></div>}
        {view === "about" && <div className="about-content"><Icon name="spark" size={42} /><h2 id="dialog-title">About EmbodyStar</h2><p>EmbodyStar is a demo shop for robot kits, components, and workbench tools. Browse the catalog, compare specifications, and save products for later.</p><p>This collection uses illustrative products, prices, and inventory. The shopping bag lives in your browser; the demo checkout never charges you or sends an order.</p><button type="button" className="button button-dark" onClick={() => { setView(null); shop(); }}>Find your next build</button></div>}
      </div></dialog>
    </div>
  );
}
