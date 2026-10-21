"use client";

import { useState } from "react";
import { LogoMark } from "@/components/Logo";

const prompts = ["Keep references beside the article", "Give my reply more room", "Keep navigation in view"];

export function SidebarPreview() {
  const [open, setOpen] = useState(true);
  const [prompt, setPrompt] = useState(prompts[1]);

  return (
    <figure data-no-background-drag className="extension-preview" aria-label="Patches extension sidebar concept">
      <div className="extension-browser">
        <div className="extension-toolbar">
          <div className="extension-dots" aria-hidden="true"><i /><i /><i /></div>
          <span className="extension-address">Your everyday tabs</span>
          <button type="button" className="extension-launcher" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="sidebar-concept" aria-label={open ? "Close sidebar preview" : "Open sidebar preview"}><LogoMark className="h-5 w-5" /></button>
        </div>
        <div className="extension-stage">
          <div className="extension-page" aria-hidden="true">
            <div className="extension-page-nav"><span /><span /><span /></div>
            <div className="extension-page-title" />
            <div className="extension-page-line" /><div className="extension-page-line short" />
            <div className="extension-page-image"><span>Your context.<br /><em>Right where you need it.</em></span></div>
            <div className="extension-page-line" /><div className="extension-page-line" /><div className="extension-page-line short" />
          </div>
          <aside id="sidebar-concept" className={`extension-sidebar ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
            <div className="extension-sidebar-header"><span><LogoMark className="h-6 w-6" />Patches</span><button type="button" aria-label="Close sidebar preview" onClick={() => setOpen(false)}>×</button></div>
            <div className="extension-sidebar-body">
              <span className="extension-page-tag">ON THIS PAGE</span>
              <h2>Your page.<br />A different perspective.</h2>
              <p>What would you like to change?</p>
              <div className="extension-suggestions">{prompts.map(text => <button key={text} type="button" aria-pressed={prompt === text} onClick={() => setPrompt(text)}>{text}<span aria-hidden="true">↗</span></button>)}</div>
              <div className="extension-composer"><label htmlFor="concept-prompt">Your patch</label><textarea id="concept-prompt" rows={2} value={prompt} maxLength={180} onChange={event => setPrompt(event.target.value)} /><div><span>Plain English. Your preferences.</span><span className="extension-send" aria-hidden="true">↑</span></div></div>
              <span className="extension-concept-note">Interface concept · live demo coming later</span>
            </div>
          </aside>
          {!open && <button type="button" className="extension-reopen" onClick={() => setOpen(true)}><LogoMark className="h-5 w-5" />Open Patches <span aria-hidden="true">←</span></button>}
        </div>
      </div>
      <figcaption><span className="extension-caption-line" aria-hidden="true" />Your page. A sidebar. Endless little improvements.</figcaption>
    </figure>
  );
}
