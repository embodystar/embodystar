import Image from "next/image";
import { explorationAreas, faqs, landing, learningLoop, resources } from "../lib/landing";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h16m-6-6 6 6-6 6"} /></svg>;
}

function Brand() {
  return <a href="#top" className="brand" aria-label="EmbodyStar home"><svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m16 1 3.8 11.2L31 16l-11.2 3.8L16 31l-3.8-11.2L1 16l11.2-3.8L16 1Z" fill="currentColor" /></svg><span>embody<span className="brand-light">star</span></span></a>;
}

function ConceptArt({ index }: { index: number }) {
  return <div className="concept-art" aria-hidden="true">{index === 0 ? <><span className="sensing-ring ring-one" /><span className="sensing-ring ring-two" /><span className="sensing-core" /><span className="sensing-cross horizontal" /><span className="sensing-cross vertical" /></> : index === 1 ? <svg viewBox="0 0 280 160" fill="none"><path d="M44 130h73m-38 0V99l46-49 61 34 31-37" stroke="currentColor" strokeWidth="14" strokeLinejoin="round" /><path d="m207 35 20 13 8-22M227 48l4 22 14-3" stroke="currentColor" strokeWidth="4" /><circle cx="125" cy="50" r="12" fill="var(--color-paper-2)" stroke="currentColor" strokeWidth="3" /><circle cx="186" cy="84" r="10" fill="var(--color-paper-2)" stroke="currentColor" strokeWidth="3" /><path d="M163 132h64m-32-16v16" stroke="currentColor" strokeWidth="2" strokeDasharray="4 5" /></svg> : <svg viewBox="0 0 280 160" fill="none"><path d="M82 110c-33-44 0-81 45-79 36 1 52 14 67 44m4-28-1 32-32-3M198 96c1 38-41 53-77 38" stroke="currentColor" strokeWidth="3" /><path d="m135 117-19 15 14 20" stroke="currentColor" strokeWidth="3" /><circle cx="79" cy="111" r="9" fill="currentColor" /><circle cx="148" cy="33" r="5" fill="currentColor" /><circle cx="197" cy="96" r="5" fill="currentColor" /></svg>}</div>;
}

export default function Home() {
  return (
    <div id="top" className="landing">
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="site-header page-width">
        <Brand />
        <nav className="main-nav" aria-label="Main navigation"><a href="#about">About</a><a href="#explore">Exploration</a><a href="#resources">Resources</a></nav>
        <a className="header-cta" href={landing.repository} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a>
      </header>
      <main id="main">
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> EMBODIED INTELLIGENCE</p>
            <h1 id="hero-title">Intelligence,<br />in the <span>real world.</span></h1>
            <p className="hero-description">{landing.description}</p>
            <div className="hero-actions"><a className="button button-primary" href="#about">Discover EmbodyStar <Arrow /></a><a className="quiet-link" href="#resources">Explore open source <Arrow diagonal /></a></div>
            <div className="hero-note"><span>From understanding to interaction</span><span className="note-rule" /><span>Perceive · Act · Learn</span></div>
          </div>
          <figure className="hero-figure">
            <div className="figure-topline"><span>THE PHYSICAL SIDE OF AI</span><span>01 / EXPLORATION</span></div>
            <div className="hero-image"><Image src="/images/lerobot-arm.jpg" alt="Turquoise robot arms from the open-source LeRobot project interacting on a tabletop" width={640} height={334} preload sizes="(max-width: 760px) 100vw, 52vw" /><span className="image-corner corner-top" /><span className="image-corner corner-bottom" /></div>
            <div className="figure-bottom"><span className="figure-symbol" aria-hidden="true">↗</span><p>The next step for AI.<br /><strong>Out in the real world.</strong></p></div>
            <figcaption>Open-source reference · LeRobot / Hugging Face</figcaption>
          </figure>
        </section>
        <div className="principles page-width" aria-label="Project focus areas"><span>Grounded in the physical. Driven by interaction.</span><div><span>Embodied perception</span><span>Robot learning</span><span>Real-world interaction</span></div></div>
        <section id="about" className="about-section section-space page-width" aria-labelledby="about-title">
          <div className="section-label"><span>01 / ABOUT</span><span>About EmbodyStar</span></div>
          <div className="about-body"><h2 id="about-title">Beyond the screen.<br /><span>Into every action.</span></h2><div className="about-copy"><p>{landing.about}</p><p>{landing.approach}</p><a className="inline-link" href="#explore">Explore our focus <Arrow /></a></div></div>
        </section>
        <section id="explore" className="explore-section section-space page-width" aria-labelledby="explore-title">
          <div className="section-heading"><div><p className="eyebrow">02 / EXPLORATION</p><h2 id="explore-title">From observation to action.</h2></div><p>Three connected areas.<br />One starting point for embodied intelligence.</p></div>
          <div className="exploration-grid">{explorationAreas.map((area, index) => <article className="exploration-card" key={area.title}><div className="card-top"><span>0{index + 1}</span><span>{area.english}</span></div><ConceptArt index={index} /><h3>{area.title}</h3><p>{area.description}</p><span className="card-keywords">{area.keywords}</span></article>)}</div>
          <p className="section-footnote">{landing.focusNote}</p>
        </section>
        <section className="loop-section" aria-labelledby="loop-title"><div className="page-width loop-inner"><div className="loop-intro"><p className="eyebrow">03 / THE LEARNING LOOP</p><h2 id="loop-title">Understand through action.<br />Learn through feedback.</h2><p>Give intelligence a concrete task to explore.</p><a className="quiet-link" href="#resources">Start with open source <Arrow /></a></div><ol className="loop-steps">{learningLoop.map((step, index) => <li key={step.title}><span className="step-number">0{index + 1}</span><div><h3>{step.title}<span>{step.english}</span></h3><p>{step.description}</p></div><span className="step-arrow" aria-hidden="true">↘</span></li>)}</ol></div></section>
        <section id="resources" className="resources-section section-space page-width" aria-labelledby="resources-title"><div className="section-heading"><div><p className="eyebrow">04 / OPEN RESOURCES</p><h2 id="resources-title">An open place to start.</h2></div><p>Meet the project and the open-source community.<br />Find a starting point for your next idea.</p></div><div className="resource-list">{resources.map((resource, index) => <a className="resource-row" key={resource.title} href={resource.url} target="_blank" rel="noreferrer"><span className="resource-index">0{index + 1}</span><div className="resource-name"><span>{resource.label}</span><h3>{resource.title}</h3></div><p>{resource.description}</p><span className="resource-arrow"><Arrow diagonal /></span></a>)}</div></section>
        <section className="faq-section page-width section-space" aria-labelledby="faq-title"><div><p className="eyebrow">A FEW MORE THINGS</p><h2 id="faq-title">A little more to know.</h2></div><div className="faq-list">{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span className="faq-toggle" aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div></section>
        <section className="closing-section page-width" aria-labelledby="closing-title"><div><p className="eyebrow">BEYOND THE SCREEN. INTO THE WORLD.</p><h2 id="closing-title">Next stop.<br />The real world.</h2></div><a className="button button-light" href={landing.repository} target="_blank" rel="noreferrer">Explore on GitHub <Arrow diagonal /></a></section>
      </main>
      <footer className="site-footer page-width"><div className="footer-main"><Brand /><p>Exploring embodied intelligence, one idea at a time.</p><a href="#top" className="back-top">Back to top ↑</a></div><div className="footer-bottom"><span>© EmbodyStar · Exploring embodied intelligence</span><span>Robot arm image: <a href="https://github.com/huggingface/lerobot" target="_blank" rel="noreferrer">LeRobot / Hugging Face</a> · <a href="/images/LEROBOT-LICENSE.txt">Apache 2.0</a>. Open-source reference imagery.</span></div></footer>
    </div>
  );
}
