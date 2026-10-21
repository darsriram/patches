"use client";

import { useId, useState } from "react";
import { LogoMark } from "@/components/Logo";

export function SentenceLayoutMap() {
  const [paired, setPaired] = useState(true);
  const [pinned, setPinned] = useState(true);
  const [wide, setWide] = useState(true);
  const all = paired && pinned && wide;
  return (
    <figure className="sentence-map" data-no-page-motion data-no-background-drag>
      <div className="sentence-map-prompt"><span><LogoMark className="h-6 w-6" />ONE SENTENCE. THREE LAYOUT CHOICES.</span><p>Keep the conversation <button type="button" aria-pressed={paired} onClick={() => setPaired(!paired)}>beside my reply</button>, <button type="button" aria-pressed={pinned} onClick={() => setPinned(!pinned)}>pin the details</button>, and <button type="button" aria-pressed={wide} onClick={() => setWide(!wide)}>widen the writing area</button>.</p><small>Click a highlighted phrase to change the illustration.</small></div>
      <div className="sentence-map-wires" aria-hidden="true"><svg viewBox="0 0 900 65" preserveAspectRatio="none"><path d="M450 0V22Q450 32 440 32H160Q150 32 150 42V65M450 0V65M450 0V22Q450 32 460 32H740Q750 32 750 42V65" /></svg><span>YOUR WORDS BECOME A LAYOUT</span></div>
      <div className="sentence-map-labels"><span className={paired ? "enabled" : ""}>01 · Context beside action</span><span className={pinned ? "enabled" : ""}>02 · Details kept in view</span><span className={wide ? "enabled" : ""}>03 · Space for your work</span></div>
      <div className={`mapped-workspace ${paired ? "is-paired" : ""} ${pinned ? "is-pinned" : ""} ${wide ? "is-wide" : ""}`}>
        <div className="mapped-workspace-bar"><span>REPLYDESK</span><span>Request #1042 · Address update</span><button type="button" onClick={() => { setPaired(!all); setPinned(!all); setWide(!all); }}>{all ? "See original layout ↺" : "Apply all layout changes →"}</button></div>
        <div className="mapped-workspace-body"><aside className="mapped-context"><span>CUSTOMER DETAILS</span><strong>Alex Morgan</strong><p>Order #2048</p><p>Delivery address update</p><div className="mapped-detail-note">Keep these details nearby.</div></aside><article className="mapped-thread"><span>CONVERSATION</span><div><strong>Alex</strong><p>Could you help me update my delivery address?</p></div><div><strong>You</strong><p>Of course. Send the new address and I’ll take a look.</p></div></article><div className="mapped-editor"><span>YOUR REPLY</span><p>Thanks, Alex.<br /><br />I have the details here. Let’s get your delivery address updated.</p><div className="mapped-editor-tools" aria-hidden="true"><b>B</b><i>I</i><span>↗</span><span>Draft</span></div></div></div>
      </div>
      <figcaption aria-live="polite">{paired ? "Conversation beside reply" : "Conversation above reply"} · {pinned ? "Details docked" : "Details in the side panel"} · {wide ? "Writing area expanded" : "Standard writing width"}</figcaption>
    </figure>
  );
}

export function ReadingWorkbench() {
  const [width, setWidth] = useState(56);
  const [source, setSource] = useState(1);
  const id = useId();
  return (
    <figure className="reading-workbench" data-no-page-motion data-no-background-drag>
      <div className="reading-workbench-toolbar"><span>READING ROOM</span><span>One page. Two connected views.</span></div>
      <div className="reading-workbench-layout" style={{ gridTemplateColumns: `${width}fr ${100 - width}fr` }}>
        <article className="reading-workbench-article"><span>ARTICLE</span><h3>Keep the source<br /><em>close to the idea.</em></h3><p>A good reading setup lets you move between an idea and its source without losing your place. <button type="button" aria-pressed={source === 1} onClick={() => setSource(1)} aria-label="Highlight reference 1">[1]</button></p><p>With references on the same page placed alongside the article, you can follow the connection in context. <button type="button" aria-pressed={source === 2} onClick={() => setSource(2)} aria-label="Highlight reference 2">[2]</button></p><p>Your preferred balance might change with the material. Give the article more room, or make space for the details. <button type="button" aria-pressed={source === 3} onClick={() => setSource(3)} aria-label="Highlight reference 3">[3]</button></p></article>
        <aside className="reading-workbench-sources"><span>REFERENCES ON THIS PAGE</span>{["Visual hierarchy and reading", "Sources, in context", "A more flexible workspace"].map((title, index) => <button key={title} type="button" aria-pressed={source === index + 1} onClick={() => setSource(index + 1)}><small>0{index + 1}</small><strong>{title}</strong><span>Sample reference · Reading notes</span></button>)}</aside>
      </div>
      <div className="reading-workbench-resize"><label htmlFor={id}>Find your balance</label><input id={id} type="range" min="38" max="65" value={width} onChange={event => setWidth(Number(event.target.value))} aria-valuetext={`Article ${width} percent, references ${100 - width} percent`} /><span>{width} / {100 - width}</span></div>
      <figcaption>Illustrated concept. Drag to change the column balance; click a citation to highlight its reference.</figcaption>
    </figure>
  );
}
