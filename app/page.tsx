"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { resources, type Kind, type Resource } from "../lib/resources";

const categories: { name: Kind; icon: string; description: string }[] = [{ name: "Models", icon: "cube", description: "Intelligence in action" }, { name: "Datasets", icon: "layers", description: "Data for discovery" }, { name: "Simulation", icon: "orbit", description: "Build virtual worlds" }, { name: "Research", icon: "paper", description: "Ideas moving us forward" }];
function Icon({ name, size = 20 }: { name: string; size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === "search" ? <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></> : name === "bookmark" ? <path d="M6 4h12v17l-6-4-6 4V4Z" /> : name === "grid" ? <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></> : name === "cube" ? <><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10L3 7m9 5 9-5m-9 5v10M7 4.8l10 5.5" /></> : name === "layers" ? <><path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5" /></> : name === "orbit" ? <><circle cx="12" cy="12" r="3" /><ellipse cx="12" cy="12" rx="11" ry="5" transform="rotate(-40 12 12)" /><path d="M7 3a10 10 0 0 1 12 15M5 20A10 10 0 0 1 4 6" /></> : name === "paper" ? <><path d="M5 3h10l4 4v14H5V3Zm10 0v5h4M9 12h6m-6 4h6" /></> : name === "tools" ? <><path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18" /></> : name === "arrow" ? <path d="M5 12h14m-5-5 5 5-5 5" /> : name === "external" ? <><path d="M14 4h6v6m0-6L10 14M10 4H4v16h16v-6" /></> : name === "plus" ? <path d="M12 5v14M5 12h14" /> : name === "close" ? <path d="m6 6 12 12M6 18 18 6" /> : name === "menu" ? <path d="M4 6h16M4 12h16M4 18h16" /> : <><circle cx="12" cy="12" r="9" /><path d="m9 15 2-6 4 2-2 4-4 0Z" /></>}</svg>; }
function Star({ className = "" }: { className?: string }) { return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="m20 2 4.5 13.5L38 20l-13.5 4.5L20 38l-4.5-13.5L2 20l13.5-4.5L20 2Z" fill="currentColor" /><path d="m31 4 1.3 3.7L36 9l-3.7 1.3L31 14l-1.3-3.7L26 9l3.7-1.3L31 4Z" fill="currentColor" /></svg>; }
export default function Home() {
  const [active, setActive] = useState("Discover");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [custom, setCustom] = useState<Resource[]>([]);
  const [ready, setReady] = useState(false);
  const [copyrightYear, setCopyrightYear] = useState<number | null>(null);
  const [selected, setSelected] = useState<Resource | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sort, setSort] = useState("Featured");
  const [notice, setNotice] = useState("");
  const search = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const frame = requestAnimationFrame(() => { setCopyrightYear(new Date().getFullYear()); try { const storedSaved: unknown = JSON.parse(localStorage.getItem("embodystar-saved") || "[]"); const storedCustom: unknown = JSON.parse(localStorage.getItem("embodystar-resources") || "[]"); if (Array.isArray(storedSaved)) setSaved(storedSaved.filter((id): id is string => typeof id === "string")); if (Array.isArray(storedCustom)) setCustom(storedCustom.filter((r): r is Resource => r && typeof r.id === "string" && typeof r.title === "string" && typeof r.description === "string" && Array.isArray(r.tags) && /^https?:\/\//.test(r.url))); } catch {} setReady(true); }); return () => cancelAnimationFrame(frame); }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem("embodystar-saved", JSON.stringify(saved)); localStorage.setItem("embodystar-resources", JSON.stringify(custom)); } catch { /* The portal remains usable when browser storage is unavailable. */ } } }, [saved, custom, ready]);
  useEffect(() => { const shortcut = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); search.current?.focus(); } }; window.addEventListener("keydown", shortcut); return () => window.removeEventListener("keydown", shortcut); }, []);
  useEffect(() => { if (selected || submitOpen) dialog.current?.showModal(); else dialog.current?.close(); }, [selected, submitOpen]);
  function close() { setSelected(null); setSubmitOpen(false); }
  function navigate(name: string) { setActive(name); setQuery(""); setMobileMenu(false); }
  function toggleSave(id: string) { setSaved(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]); }
  const all = [...custom, ...resources];
  const visible = all.filter(r => (active === "Discover" || active === "All resources" || (active === "Saved resources" ? saved.includes(r.id) : r.kind === active)) && `${r.title} ${r.org} ${r.description} ${r.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === "A to Z" ? a.title.localeCompare(b.title) : 0);
  const discovery = active === "Discover" && !query;
  return (
    <div className="portal-shell">
      <a className="skip-link" href="#resource-section">Skip to resources</a>
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <a className="brand" href="#" onClick={() => navigate("Discover")}>
          <Star /><span>EmbodyStar<small>The embodied AI index</small></span>
        </a>
        <button className="mobile-close icon-button" aria-label="Close navigation" onClick={() => setMobileMenu(false)}><Icon name="close" /></button>
        <nav aria-label="Main navigation">
          <button className={active === "Discover" ? "nav-item active" : "nav-item"} aria-current={active === "Discover" ? "page" : undefined} onClick={() => navigate("Discover")}><Icon name="compass" /><span>Discover</span></button>
          <button className={active === "All resources" ? "nav-item active" : "nav-item"} onClick={() => navigate("All resources")}><Icon name="grid" /><span>All resources</span><span className="nav-count">{all.length}</span></button>
          <div className="nav-label">Browse by subject</div>
          {[...categories, { name: "Tools", icon: "tools" }].map(c => (
            <button key={c.name} className={active === c.name ? "nav-item active" : "nav-item"} onClick={() => navigate(c.name)}><Icon name={c.icon} /><span>{c.name === "Research" ? "Research papers" : c.name === "Simulation" ? "Simulators" : c.name}</span></button>
          ))}
          <div className="nav-divider" />
          <button className={active === "Saved resources" ? "nav-item active" : "nav-item"} onClick={() => navigate("Saved resources")}><Icon name="bookmark" /><span>Saved resources</span><span className="nav-count">{saved.length}</span></button>
        </nav>
        <div className="sidebar-bottom">
          <p>A reference shelf<br />for things that move.</p>
          <button className="secondary-button" onClick={() => setSubmitOpen(true)}><Icon name="plus" size={17} />Add a resource</button>
          <small>Saved on this device.</small>
        </div>
      </aside>
      {mobileMenu && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setMobileMenu(false)} />}
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb"><button className="mobile-toggle icon-button" aria-label="Open navigation" onClick={() => setMobileMenu(true)}><Icon name="menu" /></button><span>EmbodyStar</span><span aria-hidden="true">/</span><strong>{active}</strong></div>
          <a className="github-link" href="https://github.com/topics/embodied-ai" target="_blank" rel="noreferrer"><Icon name="tools" size={16} />Community<Icon name="external" size={15} /></a>
        </header>
        <main>
          <div className="page-heading">
            <h1>{active === "Discover" ? "Discover embodied intelligence." : active === "Saved resources" ? "Your reference shelf." : active === "All resources" ? "The resource index." : active === "Simulation" ? "Simulators." : active === "Research" ? "Research papers." : `${active}.`}</h1>
            <p>{active === "Discover" ? "The ideas, models, and tools bringing intelligence into the real world." : active === "Saved resources" ? "Your bookmarked resources, kept on this device." : "Find the next building block for your robotics project."}</p>
          </div>
          <div className="search-bar">
            <Icon name="search" size={21} />
            <input ref={search} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search the index…" aria-label="Search resources" />
            <button className="search-shortcut" onClick={() => { if (query) setQuery(""); else search.current?.focus(); }} aria-label={query ? "Clear search" : "Focus search"}>{query ? <Icon name="close" size={16} /> : <><span>⌘</span>K</>}</button>
          </div>
          {discovery && <>
            <section className="discovery-panel" aria-label="Featured resource">
              <div className="featured-resource">
                <h2>Great ideas.<br />Real-world possibilities.</h2>
                <p>Meet LeRobot. Open models, datasets, and tools to take your next robotics project further.</p>
                <div className="feature-actions"><button className="primary-button" onClick={() => setSelected(resources[0])}>Explore LeRobot<Icon name="arrow" size={17} /></button><button className="text-button" onClick={() => { navigate("All resources"); document.getElementById("resource-section")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>Browse resources</button></div>
                <span className="feature-caption">From the open-source community at Hugging Face</span>
              </div>
              <div className="feature-image"><Image src="/images/lerobot-arm.jpg" alt="Two turquoise LeRobot arms learning a manipulation task" width={640} height={352} unoptimized preload /><div className="feature-image-caption"><span>From learning to doing.</span><Icon name="orbit" size={22} /></div></div>
            </section>
            <section className="subject-index" aria-label="Browse by subject">
              {categories.map(c => <button key={c.name} onClick={() => navigate(c.name)}><Icon name={c.icon} size={23} /><span>{c.name === "Simulation" ? "Simulators" : c.name === "Research" ? "Research papers" : c.name}<small>{c.description}</small></span><Icon name="arrow" size={15} /></button>)}
            </section>
          </>}
          <section id="resource-section" className="resource-section" aria-labelledby="resource-heading">
            <div className="section-title-row"><h2 id="resource-heading">{query ? "Search results" : active === "Saved resources" ? "Saved resources" : "Find your next building block"}<span className="result-count">{visible.length}</span></h2><label className="sort-control"><span>Sort by</span><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort resources"><option>Featured</option><option>A to Z</option></select></label></div>
            <div className="filter-row" aria-label="Resource categories">
              {["All", "Models", "Datasets", "Simulation", "Research", "Tools"].map(f => <button key={f} aria-pressed={f === "All" ? ["Discover", "All resources", "Saved resources"].includes(active) : active === f} className={(f === "All" ? ["Discover", "All resources", "Saved resources"].includes(active) : active === f) ? "filter active" : "filter"} onClick={() => { setActive(f === "All" ? active === "Saved resources" ? active : "All resources" : f); }}>{f === "Simulation" ? "Simulators" : f === "Research" ? "Papers" : f === "All" ? "All resources" : f}</button>)}
            </div>
            {notice && <div className="notice" role="status">{notice}<button className="icon-button" onClick={() => setNotice("")} aria-label="Dismiss notification"><Icon name="close" size={16} /></button></div>}
            {visible.length ? <div className="resource-list">
              <div className="resource-list-head" aria-hidden="true"><span>Resource / Description</span><span>Category</span><span>Maintainer</span><span>Save</span></div>
              {visible.map(r => <article className={`resource-row resource-${r.art}`} key={r.id}>
                <div className="resource-symbol" aria-hidden="true"><Icon name={r.kind === "Models" ? "cube" : r.kind === "Datasets" ? "layers" : r.kind === "Simulation" ? "orbit" : r.kind === "Research" ? "paper" : "tools"} size={25} /></div>
                <div className="resource-info"><button className="resource-title" onClick={() => setSelected(r)}><h3>{r.title}</h3><Icon name="external" size={15} /></button><p>{r.description}</p><div className="resource-tags">{r.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
                <span className="resource-kind">{r.kind === "Simulation" ? "Simulator" : r.kind === "Research" ? "Paper" : r.kind === "Models" ? "Model" : r.kind === "Datasets" ? "Dataset" : "Tool"}</span>
                <span className="resource-org">{r.org}</span>
                <button className={`save-button icon-button ${saved.includes(r.id) ? "is-saved" : ""}`} onClick={() => toggleSave(r.id)} aria-label={`${saved.includes(r.id) ? "Unsave" : "Save"} ${r.title}`} aria-pressed={saved.includes(r.id)}><Icon name="bookmark" size={19} /></button>
              </article>)}
            </div> : <div className="empty-state"><Icon name={active === "Saved resources" ? "bookmark" : "search"} size={28} /><h3>{active === "Saved resources" && !query ? "Your shelf is empty." : "No resources found."}</h3><p>{active === "Saved resources" && !query ? "Bookmark a resource to find it here later." : "Try another search or explore all resources."}</p><button className="secondary-button" onClick={() => navigate("All resources")}>Explore all resources</button></div>}
          </section>
          <section className="collection-note"><div><h2>Keep your own reference shelf.</h2><p>Add a useful tool, paper, or project. It stays in this browser.</p></div><button className="secondary-button" onClick={() => setSubmitOpen(true)}><Icon name="plus" size={17} />Add a resource</button></section>
          <footer className="footer"><span>© {copyrightYear !== null && `${copyrightYear} `}EmbodyStar</span><a className="image-credit" href="https://github.com/huggingface/lerobot" target="_blank" rel="noreferrer">Robotics imagery by LeRobot / Hugging Face</a><a href="https://github.com/topics/embodied-ai" target="_blank" rel="noreferrer">Explore on GitHub<Icon name="external" size={13} /></a></footer>
        </main>
      </div>
      <dialog ref={dialog} onCancel={close} onClose={close} onClick={e => { if (e.target === e.currentTarget) close(); }}>
        <button className="dialog-close icon-button" onClick={close} aria-label="Close dialog"><Icon name="close" /></button>
        {selected ? <div className="dialog-content"><h2>{selected.title}</h2><div className="detail-meta"><span>{selected.kind}</span><span>{selected.org}</span></div><p>{selected.description}</p><div className="resource-tags">{selected.tags.map(t => <span key={t}>{t}</span>)}</div><div className="dialog-actions"><a className="primary-button" href={selected.url} target="_blank" rel="noreferrer">Visit resource<Icon name="external" size={16} /></a><button className="secondary-button" onClick={() => toggleSave(selected.id)}><Icon name="bookmark" size={17} />{saved.includes(selected.id) ? "Saved to your collection" : "Save resource"}</button></div></div> : <div className="dialog-content"><h2>Add a resource.</h2><p>Your additions and bookmarks stay on this device.</p><form onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); const url = String(data.get("url")); const parsed = new URL(url); if (!["https:", "http:"].includes(parsed.protocol)) return; const resource: Resource = { id: crypto.randomUUID(), title: String(data.get("title")), description: String(data.get("description")), kind: data.get("kind") as Kind, org: "Your collection", url, tags: ["Community resource"], art: "tools" }; setCustom(prev => [resource, ...prev]); setSaved(prev => [...prev, resource.id]); navigate("All resources"); setNotice(`${resource.title} was added to your collection.`); close(); }}><label>Resource name<input name="title" required maxLength={70} placeholder="What did you discover?" /></label><label>Website URL<input name="url" type="url" pattern="https?://.*" required placeholder="https://" /></label><label>Category<select name="kind">{["Models", "Datasets", "Simulation", "Research", "Tools"].map(k => <option key={k}>{k}</option>)}</select></label><label>A short introduction<textarea name="description" required rows={3} maxLength={250} placeholder="What makes it useful?" /></label><button className="primary-button" type="submit">Add to my collection<Icon name="plus" size={17} /></button></form></div>}
      </dialog>
    </div>
  );
}
