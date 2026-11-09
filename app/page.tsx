import Image from "next/image";
import { ArchitectureExplorer } from "./components/architecture-explorer";
import { RobotScene } from "./components/robot-scene";
import { faqs, landing, resources } from "../lib/landing";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h16m-6-6 6 6-6 6"} /></svg>;
}

function Star({ className = "" }: { className?: string }) {
  return <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m16 1 3.8 11.2L31 16l-11.2 3.8L16 31l-3.8-11.2L1 16l11.2-3.8L16 1Z" fill="currentColor" /></svg>;
}

function Brand() {
  return <a href="#top" className="brand" aria-label="EmbodyStar home"><Star /><span>embody<span className="brand-light">star</span></span></a>;
}

export default function Home() {
  return <div id="top" className="landing">
    <a className="skip-link" href="#main">Skip to main content</a>
    <header className="site-header page-width"><Brand /><nav className="main-nav mono" aria-label="Main navigation"><a href="#about">Overview</a><a href="#architecture">Architecture</a><a href="#resources">Open source</a></nav><a className="header-cta mono" href={landing.repository} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a></header>
    <main id="main">
      <section className="hero page-width" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="eyebrow"><span className="status-dot" /> EMBODIED INTELLIGENCE / OPEN EXPLORATION</p><h1 id="hero-title">Intelligence.<br /><span>In motion.</span></h1><p className="hero-description">AI belongs in the physical world.<br />Explore the systems that connect perception,<br className="desktop-break" /> action, and learning.</p><div className="hero-actions"><a className="button button-primary" href="#architecture">Explore the architecture <Arrow /></a><a className="quiet-link" href={landing.repository} target="_blank" rel="noreferrer">View source <Arrow diagonal /></a></div><div className="hero-index mono"><span>01 / PERCEIVE</span><span>02 / ACT</span><span>03 / LEARN</span></div></div>
        <RobotScene />
      </section>
      <div className="signal-strip page-width mono"><span>THE WORLD IS THE INTERFACE.</span><div><span>OBSERVE</span><i /> <span>REASON</span><i /><span>ACT</span><i /><span>LEARN</span><span className="signal-loop" aria-hidden="true">↺</span></div></div>
      <section id="about" className="about-section page-width section-space" aria-labelledby="about-title"><div className="about-copy"><p className="eyebrow">01 / BEYOND THE MODEL</p><h2 id="about-title">Intelligence needs<br /><span>a world to act in.</span></h2><p>{landing.about}</p><p>{landing.approach}</p><a className="inline-link mono" href="#architecture">INSPECT THE LOOP <Arrow /></a></div><figure className="field-figure"><div className="field-heading mono"><span>FIELD NOTES / 001</span><span>PHYSICAL INTERACTION</span></div><div className="field-image"><Image src="/images/lerobot-arm.jpg" alt="Turquoise robot arms from LeRobot interacting on a tabletop" width={640} height={334} sizes="(max-width: 800px) 100vw, 45vw" /><div className="image-reticle" aria-hidden="true"><span /><span /><i /></div><div className="image-label mono">OBJECT ↗<br />INTERACTION SPACE</div></div><figcaption><span>From digital representations<br />to physical consequences.</span><span className="mono">LeRobot / Hugging Face<br />OPEN-SOURCE REFERENCE</span></figcaption></figure></section>
      <section id="architecture" className="architecture-section page-width section-space" aria-labelledby="architecture-title"><div className="section-heading"><div><p className="eyebrow">02 / SYSTEM ARCHITECTURE</p><h2 id="architecture-title">The loop is<br /><span>the intelligence.</span></h2></div><div className="section-intro"><p>Observations become actions.<br />Interactions become experience.</p><span className="mono">SELECT A LAYER TO EXPLORE ↓</span></div></div><ArchitectureExplorer /><p className="section-footnote">{landing.focusNote}</p></section>
      <section id="resources" className="resources-section page-width section-space" aria-labelledby="resources-title"><div className="section-heading"><div><p className="eyebrow">03 / OPEN BY DESIGN</p><h2 id="resources-title">Less black box.<br /><span>More open source.</span></h2></div><p>Read the code. Trace the ideas.<br />Find your next experiment.</p></div><div className="resource-grid">{resources.map((resource, index) => <a className="resource-card" key={resource.title} href={resource.url} target="_blank" rel="noreferrer"><div className="resource-card-top mono"><span>{resource.label}</span><span>0{index + 1}</span></div><div className="resource-name"><h3>{resource.title}</h3><Arrow diagonal /></div><p>{resource.description}</p><div className="resource-card-bottom mono"><span>{index === 0 ? "github.com/embodystar" : "github.com/huggingface"}</span><span>EXPLORE REPOSITORY ↗</span></div></a>)}</div></section>
      <section className="faq-section page-width section-space" aria-labelledby="faq-title"><div><p className="eyebrow">04 / CONTEXT</p><h2 id="faq-title">Before you<br /><span>dive in.</span></h2></div><div className="faq-list">{faqs.map((faq, index) => <details key={faq.question}><summary><span className="faq-index mono">0{index + 1}</span>{faq.question}<span className="faq-toggle" aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div></section>
      <section className="closing-section page-width" aria-labelledby="closing-title"><div><p className="eyebrow">THE NEXT FRONTIER IS PHYSICAL.</p><h2 id="closing-title">Step into<br /><span>the real world.</span></h2><a className="button button-primary" href={landing.repository} target="_blank" rel="noreferrer">Explore EmbodyStar <Arrow diagonal /></a></div><div className="closing-art" aria-hidden="true"><div /><div /><Star /></div><span className="closing-coordinate mono">PERCEPTION × ACTION × LEARNING</span></section>
    </main>
    <footer className="site-footer page-width"><div className="footer-main"><Brand /><p className="mono">EXPLORING EMBODIED INTELLIGENCE.</p><a href="#top" className="back-top mono">BACK TO TOP ↑</a></div><div className="footer-bottom mono"><span>© EmbodyStar / OPEN EXPLORATION</span><span>Robot arm reference: <a href="https://github.com/huggingface/lerobot" target="_blank" rel="noreferrer">LeRobot / Hugging Face</a> · <a href="/images/LEROBOT-LICENSE.txt">Apache 2.0</a></span></div></footer>
  </div>;
}
