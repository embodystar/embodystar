import Image from "next/image";
import { explorationAreas, faqs, landing, learningLoop, resources } from "../lib/landing";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h16m-6-6 6 6-6 6"} /></svg>;
}

function Brand() {
  return <a href="#top" className="brand" aria-label="EmbodyStar 首页"><svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m16 1 3.8 11.2L31 16l-11.2 3.8L16 31l-3.8-11.2L1 16l11.2-3.8L16 1Z" fill="currentColor" /></svg><span>embody<span className="brand-light">star</span></span></a>;
}

function ConceptArt({ index }: { index: number }) {
  return <div className="concept-art" aria-hidden="true">{index === 0 ? <><span className="sensing-ring ring-one" /><span className="sensing-ring ring-two" /><span className="sensing-core" /><span className="sensing-cross horizontal" /><span className="sensing-cross vertical" /></> : index === 1 ? <svg viewBox="0 0 280 160" fill="none"><path d="M44 130h73m-38 0V99l46-49 61 34 31-37" stroke="currentColor" strokeWidth="14" strokeLinejoin="round" /><path d="m207 35 20 13 8-22M227 48l4 22 14-3" stroke="currentColor" strokeWidth="4" /><circle cx="125" cy="50" r="12" fill="var(--color-paper-2)" stroke="currentColor" strokeWidth="3" /><circle cx="186" cy="84" r="10" fill="var(--color-paper-2)" stroke="currentColor" strokeWidth="3" /><path d="M163 132h64m-32-16v16" stroke="currentColor" strokeWidth="2" strokeDasharray="4 5" /></svg> : <svg viewBox="0 0 280 160" fill="none"><path d="M82 110c-33-44 0-81 45-79 36 1 52 14 67 44m4-28-1 32-32-3M198 96c1 38-41 53-77 38" stroke="currentColor" strokeWidth="3" /><path d="m135 117-19 15 14 20" stroke="currentColor" strokeWidth="3" /><circle cx="79" cy="111" r="9" fill="currentColor" /><circle cx="148" cy="33" r="5" fill="currentColor" /><circle cx="197" cy="96" r="5" fill="currentColor" /></svg>}</div>;
}

export default function Home() {
  return (
    <div id="top" className="landing">
      <a className="skip-link" href="#main">跳至主要内容</a>
      <header className="site-header page-width">
        <Brand />
        <nav className="main-nav" aria-label="主导航"><a href="#about">关于项目</a><a href="#explore">探索方向</a><a href="#resources">开源资源</a></nav>
        <a className="header-cta" href={landing.repository} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a>
      </header>
      <main id="main">
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> EMBODIED INTELLIGENCE</p>
            <h1 id="hero-title">让智能，<br />走进<span>真实世界。</span></h1>
            <p className="hero-description">{landing.description}</p>
            <div className="hero-actions"><a className="button button-primary" href="#about">了解 EmbodyStar <Arrow /></a><a className="quiet-link" href="#resources">探索开源资源 <Arrow diagonal /></a></div>
            <div className="hero-note"><span>从理解环境，到与世界交互</span><span className="note-rule" /><span>感知 · 行动 · 学习</span></div>
          </div>
          <figure className="hero-figure">
            <div className="figure-topline"><span>THE PHYSICAL SIDE OF AI</span><span>01 / EXPLORATION</span></div>
            <div className="hero-image"><Image src="/images/lerobot-arm.jpg" alt="LeRobot 开源项目中的青绿色机械臂，在真实桌面环境中交互" width={640} height={334} preload sizes="(max-width: 760px) 100vw, 52vw" /><span className="image-corner corner-top" /><span className="image-corner corner-bottom" /></div>
            <div className="figure-bottom"><span className="figure-symbol" aria-hidden="true">↗</span><p>智能的下一步，<br /><strong>发生在真实世界。</strong></p></div>
            <figcaption>开源实践参考影像 · LeRobot / Hugging Face</figcaption>
          </figure>
        </section>
        <div className="principles page-width" aria-label="项目关注领域"><span>以身体为载体，以交互为起点。</span><div><span>具身感知</span><span>机器人学习</span><span>真实环境交互</span></div></div>
        <section id="about" className="about-section section-space page-width" aria-labelledby="about-title">
          <div className="section-label"><span>01 / ABOUT</span><span>关于 EmbodyStar</span></div>
          <div className="about-body"><h2 id="about-title">智能，不止于屏幕。<br /><span>也在每一次行动之中。</span></h2><div className="about-copy"><p>{landing.about}</p><p>我们关注从感知环境、理解任务，到执行动作并获得反馈的完整过程。以开放的视角，连接具身智能的概念、开源工具与实践路径。</p><a className="inline-link" href="#explore">看看我们关注什么 <Arrow /></a></div></div>
        </section>
        <section id="explore" className="explore-section section-space page-width" aria-labelledby="explore-title">
          <div className="section-heading"><div><p className="eyebrow">02 / EXPLORATION</p><h2 id="explore-title">从观察，到行动。</h2></div><p>三个相互连接的探索方向，<br />构成理解具身智能的起点。</p></div>
          <div className="exploration-grid">{explorationAreas.map((area, index) => <article className="exploration-card" key={area.title}><div className="card-top"><span>0{index + 1}</span><span>{area.english}</span></div><ConceptArt index={index} /><h3>{area.title}</h3><p>{area.description}</p><span className="card-keywords">{area.keywords}</span></article>)}</div>
          <p className="section-footnote">以上为项目关注的探索方向，具体进展请以项目仓库为准。</p>
        </section>
        <section className="loop-section" aria-labelledby="loop-title"><div className="page-width loop-inner"><div className="loop-intro"><p className="eyebrow">03 / THE LEARNING LOOP</p><h2 id="loop-title">在交互中理解，<br />在反馈中学习。</h2><p>将抽象的智能，放进一个具体的任务里。</p><a className="quiet-link" href="#resources">从开源实践开始 <Arrow /></a></div><ol className="loop-steps">{learningLoop.map((step, index) => <li key={step.title}><span className="step-number">0{index + 1}</span><div><h3>{step.title}<span>{step.english}</span></h3><p>{step.description}</p></div><span className="step-arrow" aria-hidden="true">↘</span></li>)}</ol></div></section>
        <section id="resources" className="resources-section section-space page-width" aria-labelledby="resources-title"><div className="section-heading"><div><p className="eyebrow">04 / OPEN RESOURCES</p><h2 id="resources-title">开放探索，从这里开始。</h2></div><p>了解项目，也走近开源社区。<br />让一个想法，找到实践的起点。</p></div><div className="resource-list">{resources.map((resource, index) => <a className="resource-row" key={resource.title} href={resource.url} target="_blank" rel="noreferrer"><span className="resource-index">0{index + 1}</span><div className="resource-name"><span>{resource.label}</span><h3>{resource.title}</h3></div><p>{resource.description}</p><span className="resource-arrow"><Arrow diagonal /></span></a>)}</div></section>
        <section className="faq-section page-width section-space" aria-labelledby="faq-title"><div><p className="eyebrow">A FEW MORE THINGS</p><h2 id="faq-title">你可能还想了解。</h2></div><div className="faq-list">{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span className="faq-toggle" aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div></section>
        <section className="closing-section page-width" aria-labelledby="closing-title"><div><p className="eyebrow">BEYOND THE SCREEN. INTO THE WORLD.</p><h2 id="closing-title">下一步，<br />一起探索真实世界。</h2></div><a className="button button-light" href={landing.repository} target="_blank" rel="noreferrer">前往项目 GitHub <Arrow diagonal /></a></section>
      </main>
      <footer className="site-footer page-width"><div className="footer-main"><Brand /><p>探索具身智能，让想法与真实世界相遇。</p><a href="#top" className="back-top">回到顶部 ↑</a></div><div className="footer-bottom"><span>© EmbodyStar · 具身智能探索项目</span><span>机械臂影像来自 <a href="https://github.com/huggingface/lerobot" target="_blank" rel="noreferrer">LeRobot / Hugging Face</a>，遵循 <a href="/images/LEROBOT-LICENSE.txt">Apache 2.0</a>；仅作开源实践参考。</span></div></footer>
    </div>
  );
}
