"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { ScrollReveal } from "@/components/ScrollReveal";
const styles = {
  active: "process-active",
  article: "process-article",
  articleImage: "process-articleImage",
  browser: "process-browser",
  browserFoot: "process-browserFoot",
  command: "process-command",
  commandFoot: "process-commandFoot",
  detail: "process-detail",
  diagram: "process-diagram",
  heading: "process-heading",
  kicker: "process-kicker",
  label: "process-label",
  layoutLayer: "process-layoutLayer",
  lines: "process-lines",
  miniNav: "process-miniNav",
  mobileCopy: "process-mobileCopy",
  note: "process-note",
  number: "process-number",
  orbit: "process-orbit",
  orbitInner: "process-orbitInner",
  process: "process-process",
  progress: "process-progress",
  references: "process-references",
  savedCard: "process-savedCard",
  savedIcon: "process-savedIcon",
  scene: "process-scene",
  sceneBottom: "process-sceneBottom",
  sceneTop: "process-sceneTop",
  stepArrow: "process-stepArrow",
  stepContent: "process-stepContent",
  stepCopy: "process-stepCopy",
  steps: "process-steps",
  story: "process-story",
  toolbar: "process-toolbar",
  visual: "process-visual",
  workspace: "process-workspace",
};

function SaveReceipt({ saved }: { saved: boolean }) {
  const [complete, setComplete] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setComplete(true), !saved || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1600);
    return () => clearTimeout(timer);
  }, [saved]);
  return <div className="process-saveReceipt" data-complete={complete} data-enabled={saved}>
    <div className="process-saveHeading"><span className="process-saveGlyph">{complete ? "✓" : "↓"}</span><div><strong>{!saved ? "Preference switched off" : complete ? "Patch saved for this website" : "Saving your patch…"}</strong><span>reading.space · Website preference</span></div><span className="process-saveBadge">{!saved ? "OFF" : complete ? "SAVED" : "SAVING"}</span></div>
    <div className="process-saveTrack"><span /></div>
    <div className="process-savedEntry"><span>▤</span><div><strong>References beside article</strong><small>{saved ? "Ready for your next visit" : "Original layout restored"}</small></div><i data-on={saved} /></div>
  </div>;
}

const steps = [
  { label: "Describe", title: "Start with what you need.", copy: "Keep the references beside the article. A few words in the sidebar are all it takes to describe your ideal view.", detail: "YOUR WORDS → YOUR INTENT" },
  { label: "Shape", title: "Your sentence becomes a layout.", copy: "The Patchy sidebar opens beside your page. Describe the layout you want and send your request, without leaving the website.", detail: "YOUR INTENT → A PATCH" },
  { label: "Review", title: "See the difference, in context.", copy: "The article and its references sit side by side. Review the change on the same page, with your information still there.", detail: "A PATCH → YOUR VIEW" },
  { label: "Keep", title: "A little more you, next time.", copy: "Save your website-specific preference so your setup is ready when you return to a supported page.", detail: "YOUR VIEW → A SAVED PREFERENCE" },
];

export function WorkflowDiagram({ title = <>A better interface starts with <em>a sentence.</em></> }: { title?: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const sceneId = useId();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 900px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!desktop.matches || reduced.matches || !root.current) return;
      const bounds = root.current.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      const center = window.innerHeight * .52;
      let closest = 0;
      let distance = Infinity;
      items.current.forEach((item, index) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const next = Math.abs(rect.top + rect.height / 2 - center);
        if (next < distance) { distance = next; closest = index; }
      });
      setActive(closest);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    desktop.addEventListener("change", schedule);
    reduced.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      desktop.removeEventListener("change", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  function select(index: number) {
    setActive(index);
  }

  return (
    <div className={styles.process} ref={root} data-no-page-motion>
      <ScrollReveal className={styles.heading}>
        <p className="patches-eyebrow">How it works</p>
        <h2 id="workflow-title">{title}</h2>
        <p>From the page you’re given to the view you had in mind.</p>
      </ScrollReveal>
      <div className={styles.story}>
        <ol className={styles.steps} aria-label="How a patch comes together">
          {steps.map((step, index) => <li key={step.label} ref={element => { items.current[index] = element; }} className={active === index ? styles.active : ""}>
            <button type="button" onClick={() => select(index)} aria-pressed={active === index} aria-controls={sceneId}>
              <span className={styles.number}>0{index + 1}</span>
              <span className={styles.stepContent}><span className={styles.label}>{step.label}</span><strong>{step.title}</strong><span className={styles.stepCopy}>{step.copy}</span><span className={styles.detail}>{step.detail}</span></span>
              <span className={styles.stepArrow} aria-hidden="true">↗</span>
            </button>
          </li>)}
        </ol>
        <figure id={sceneId} className={styles.visual} data-stage={active} data-saved={saved} aria-label={`${steps[active].label}: animated layout illustration`}>
          <div className={styles.scene}>
            <div className={styles.sceneTop}><span><i /> A PATCH TAKES SHAPE</span><span>0{active + 1} / 04</span></div>
            <div className={styles.diagram} aria-hidden="true">
              <div className={styles.orbit} /><div className={styles.orbitInner} />
              <div className={styles.layoutLayer}><span>LAYOUT PLAN</span><div><b>Article</b><i /><b>References</b></div><small>Two columns. One context.</small></div>
              <div className={styles.browser}>
                <div className={styles.toolbar}><span>● ● ●</span><span>reading.space / article</span><LogoMark className="h-4 w-4" /></div>
                <div className={styles.workspace}>
                  <div className={styles.miniNav}><b>r.</b><span /><span /><span /></div>
                  <article className={styles.article}><span className={styles.kicker}>THE READING ROOM</span><h3>Good ideas deserve<br />a little more room.</h3><p>A space to follow a thought.<br />And the sources behind it.</p><div className={styles.articleImage}><span>Ideas, in context.</span><i /><i /><i /></div><div className={styles.lines}><i /><i /><i /></div></article>
                  <aside className={styles.references}><span className={styles.kicker}>REFERENCES</span>{["The shape of an idea", "Reading, connected", "A different perspective"].map((text,index) => <div key={text}><span>0{index+1}</span><strong>{text}</strong><i /></div>)}</aside>
                </div>
                <aside className="process-extensionPanel"><div className="process-extensionTitle"><LogoMark className="h-4 w-4" /><strong>Patchy</strong><span>×</span></div><div className="process-extensionInner"><div className="process-extensionSite"><LogoMark className="h-5 w-5" /><div><strong>Patchy</strong><span>reading.space</span></div><i>● Connected</i></div><div className="process-extensionInput"><p>Keep the references beside the article.</p><b>→</b></div><div className="process-extensionChips"><span>hide sidebar</span><span>larger text</span></div><div className="process-extensionSaved"><span>SAVED CHANGES</span><span>Reset site</span></div><div className="process-extensionEmpty"><span>↗</span><p>Your next little improvement<br />starts with a sentence.</p></div><div className="process-extensionToggle"><span>Changes on this page</span><i /></div></div></aside>
                <div className={styles.browserFoot}><span>Same page. Same information.</span><span>{active > 1 && (active !== 3 || saved) ? "Your layout ✓" : "Original layout"}</span></div>
              </div>
              <div className={styles.command}><div><LogoMark className="h-5 w-5" /><strong>Patchy</strong><span>{active === 0 ? "Your request" : active === 1 ? "Shaping the layout" : "Patch ready"}</span></div><p>Keep the references <mark>beside the article.</mark></p><div className={styles.commandFoot}><span>{active < 2 ? "A few words. A new perspective." : "Article + references, side by side"}</span><b>{active < 2 ? "↑" : "✓"}</b></div></div>
              {active === 3 && <SaveReceipt key={saved ? "enabled" : "disabled"} saved={saved} />}
            </div>
            <div className={styles.sceneBottom}><div className={styles.progress}>{steps.map((step,index) => <span key={step.label} data-complete={index <= active} />)}</div><span>{active === 0 ? "01 — A sentence" : active === 1 ? "02 — The Patchy sidebar" : active === 2 ? "03 — A different view" : "04 — Your preference"}</span>{active === 3 && <button type="button" onClick={() => setSaved(!saved)} aria-pressed={saved}>{saved ? "Turn off" : "Restore"} <span aria-hidden="true">↺</span></button>}</div>
          </div>
          <figcaption>Animated product concept · supported pages only</figcaption>
        </figure>
        <div className={styles.mobileCopy} aria-live="polite"><h3>{steps[active].title}</h3><p>{steps[active].copy}</p></div>
      </div>
      <p className={styles.note}><span aria-hidden="true">↳</span> You describe the change. Patchy changes the presentation.</p>
    </div>
  );
}
