"use client";

import { useRef, useState } from "react";
import { architectureStages } from "../../lib/landing";

export function ArchitectureExplorer() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const stage = architectureStages[active];

  return <div className="architecture-explorer">
    <div className="architecture-selector" role="tablist" aria-label="Explore the intelligence loop" aria-orientation="vertical">
      {architectureStages.map((item, index) => <button key={item.id} ref={(element) => { buttons.current[index] = element; }} type="button" role="tab" id={`tab-${item.id}`} aria-controls="architecture-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => {
        let next = active;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (active + 1) % architectureStages.length;
        else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (active + architectureStages.length - 1) % architectureStages.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = architectureStages.length - 1;
        else return;
        event.preventDefault(); setActive(next); buttons.current[next]?.focus();
      }}><span className="stage-index mono">0{index + 1}</span><div><span className="stage-label mono">{item.id.toUpperCase()}</span><h3>{item.title}</h3><p>{item.description}</p></div><span className="stage-select-arrow" aria-hidden="true">↗</span></button>)}
    </div>
    <div className="architecture-panel" role="tabpanel" id="architecture-panel" aria-labelledby={`tab-${stage.id}`} tabIndex={0}>
      <div className="code-window"><div className="code-title mono"><div className="window-dots" aria-hidden="true"><i /><i /><i /></div><span>{stage.filename}</span><span>JSON</span></div><div className="code-body"><div className="code-numbers mono" aria-hidden="true">{stage.code.split("\n").map((_, index) => <span key={index}>{index + 1}</span>)}</div><pre><code>{stage.code.split(/("[^"\n]*"|\b\d+(?:\.\d+)?\b)/g).map((token, index) => <span key={index} className={token.startsWith('"') ? "syntax-string" : /^\d/.test(token) ? "syntax-number" : undefined}>{token}</span>)}</code></pre></div><div className="code-bottom mono"><span><i className="status-dot" /> CONCEPTUAL DATA FLOW</span><span>UTF-8</span></div></div>
      <div className="data-flow"><div><span className="mono">INPUT</span><strong>{stage.input}</strong></div><span className="flow-connector" aria-hidden="true">→</span><div><span className="mono">OUTPUT</span><strong>{stage.output}</strong></div></div>
      <p className="architecture-note">{stage.note}</p>
    </div>
  </div>;
}
