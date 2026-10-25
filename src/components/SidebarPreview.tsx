"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LogoMark } from "@/components/Logo";

type PatchKind = "ingredients" | "servings" | "layout";
type Patch = { kind: PatchKind; label: string; enabled: boolean };
const suggestions: { kind: PatchKind; label: string; prompt: string }[] = [
  { kind: "ingredients", label: "ingredient checks", prompt: "Add a checkbox beside each ingredient so I can tick off what I’ve prepared." },
  { kind: "servings", label: "adjust servings", prompt: "Add a servings selector and recalculate every ingredient quantity when I change it." },
  { kind: "layout", label: "steps first", prompt: "Move the cooking instructions above the ingredients so I can follow the recipe without scrolling past the ingredient list." },
];
const labels: Record<PatchKind, string> = { ingredients: "Ingredient checkboxes", servings: "Servings + scaled quantities", layout: "Cooking instructions first" };
const ingredients = [{ amount: 200, unit: "g", name: "pasta" }, { amount: 2, unit: "cups", name: "cherry tomatoes" }, { amount: 2, unit: "tbsp", name: "olive oil" }, { amount: 2, unit: "cloves", name: "garlic" }];
const cookingSteps = ["Cook pasta in salted water until tender.", "Sauté garlic and tomatoes in olive oil.", "Toss with pasta and serve warm."];

export function SidebarPreview() {
  const [open, setOpen] = useState(true);
  const [prompt, setPrompt] = useState(suggestions[0].prompt);
  const [patches, setPatches] = useState<Patch[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [servings, setServings] = useState(2);
  const [prepared, setPrepared] = useState<number[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const has = (kind: PatchKind) => enabled && patches.some(patch => patch.kind === kind && patch.enabled);
  function close() { setOpen(false); launcher.current?.focus(); }
  function reset() {
    if (timer.current) clearTimeout(timer.current);
    setBusy(false); setPatches([]); setEnabled(true); setServings(2); setPrepared([]); setMessage("Sample recipe reset.");
  }
  function apply(example: typeof suggestions[number]) {
    if (busy) return;
    setPrompt(example.prompt);
    const kinds = [example.kind];
    setBusy(true); setMessage("Creating your patch…");
    timer.current = setTimeout(() => {
      setPatches(previous => [...previous.filter(patch => !kinds.includes(patch.kind)), ...kinds.map(kind => ({ kind, label: labels[kind], enabled: true }))]);
      setEnabled(true); setBusy(false); setMessage("Patch applied and saved in this preview."); timer.current = null;
    }, 650);
  }
  return <figure className="extension-preview p-demo" data-no-background-drag data-no-page-motion aria-label="Interactive Patches sidebar demo">
    <div className="p-demo-browser">
      <div className="p-demo-toolbar"><span aria-hidden="true">● ● ●</span><span>littlekitchen.example / tomato-pasta</span><button ref={launcher} type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={panelId} aria-label={open ? "Close Patches demo sidebar" : "Open Patches demo sidebar"}><LogoMark className="h-5 w-5" /></button></div>
      <div className="p-demo-stage" data-open={open}>
        <div className="p-demo-page p-demo-recipe" >
          <header><strong>little kitchen.</strong><span>SIMPLE FOOD, EVERY DAY</span></header>
          <svg className="p-recipe-art" viewBox="0 0 360 160" role="img" aria-label="Illustration of tomato pasta with fresh basil in a ceramic bowl">
            <rect width="360" height="160" rx="12" fill="#f5e6d6" />
            <path d="M0 126L360 66M0 146L360 86" stroke="#e9d5bf" strokeWidth="2" />
            <ellipse cx="184" cy="127" rx="107" ry="18" fill="#d5b99b" opacity=".4" />
            <ellipse cx="180" cy="84" rx="111" ry="62" fill="#fffaf1" />
            <ellipse cx="180" cy="84" rx="92" ry="47" fill="#d46a37" />
            <g fill="none" stroke="#f6c66e" strokeWidth="7" strokeLinecap="round">
              <path d="M114 69q38-27 62 9t65-8M108 90q30-25 56 6t77-3M132 108q23-28 51-6t40 4M136 53q-8 22 19 34t-3 30M196 48q-20 16 8 35t-8 34M224 56q25 13 2 28" />
            </g>
            <g fill="#ae3d28"><circle cx="133" cy="82" r="9"/><circle cx="219" cy="95" r="10"/><circle cx="192" cy="62" r="8"/></g>
            <g fill="#607845"><path d="M168 75q-25-30-35-10 10 21 35 10Z"/><path d="M170 75q-4-35 17-24 8 17-17 24Z"/><path d="M202 105q22-25 30-6-10 17-30 6Z"/></g>
            <path d="M307 23l-12 102M315 24l-12 101M323 25l-12 101M295 124l-4 25" fill="none" stroke="#9e9689" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <article data-steps-first={has("layout")}><span className="p-demo-kicker">DINNER · 20 MINUTES</span><h3>One-pan tomato pasta</h3><p>A bright, simple dinner for two.</p>
            {has("servings") ? <div className="p-recipe-servings"><label htmlFor={`${panelId}-servings`}>Servings</label><select id={`${panelId}-servings`} value={servings} onChange={event => setServings(Number(event.target.value))}>{[1, 2, 4, 6].map(value => <option key={value} value={value}>{value}</option>)}</select></div> : <p className="p-recipe-meta">Serves 2</p>}
            <section aria-label="Recipe ingredients"><h4>Ingredients</h4><ul className="p-recipe-list">{ingredients.map((ingredient, index) => {
              const amount = ingredient.amount * (has("servings") ? servings : 2) / 2;
              const text = `${amount} ${ingredient.unit} ${ingredient.name}`;
              return <li key={ingredient.name} data-checked={has("ingredients") && prepared.includes(index)}>{has("ingredients") ? <label><input type="checkbox" checked={prepared.includes(index)} onChange={() => setPrepared(previous => previous.includes(index) ? previous.filter(item => item !== index) : [...previous, index])} /><span>{text}</span></label> : <span>{text}</span>}</li>;
            })}</ul></section>
            <section aria-label="Cooking instructions"><h4>Method</h4><ol className="p-recipe-list">{cookingSteps.map((step, index) => <li key={step}><span>{index + 1}. {step}</span></li>)}</ol></section>
            {has("ingredients") && <button type="button" className="p-recipe-reset" onClick={() => setPrepared([])}>Reset recipe</button>}
          </article>
          <footer>Little Kitchen · Sample recipe</footer>
        </div>
        <aside id={panelId} className="p-demo-sidebar" aria-label="Patches demo controls" aria-hidden={!open} inert={!open} onKeyDown={event => { if (event.key === "Escape") close(); }}>
          <div className="p-demo-shell-title"><span><LogoMark className="h-5 w-5" />Patches</span><button type="button" onClick={close} aria-label="Close demo panel">×</button></div>
          <div className="p-demo-inner">
            <header className="p-demo-site"><LogoMark className="h-6 w-6" /><div><strong>Patches</strong><span>littlekitchen.example</span></div><span className="p-demo-connected"><i />Demo</span></header>
            <div className="p-demo-form"><div className="p-demo-compose"><div className="p-demo-prompt-display" aria-label="Selected example request">{prompt}</div><span className="p-demo-send-display" aria-hidden="true">{busy ? <span className="p-demo-spinner" /> : "→"}</span></div><p className="p-demo-choose">Click a suggestion to change this page</p><div className="p-demo-chips">{suggestions.map(example => <button key={example.kind} type="button" disabled={busy} aria-pressed={prompt === example.prompt && has(example.kind)} onClick={() => apply(example)}><span aria-hidden="true">↗</span> {example.label}</button>)}</div></div>
            <div className="p-demo-saved-title"><strong>SAVED PATCHES</strong><button type="button" onClick={reset}>Reset site</button></div>
            <p role="status" aria-live="polite" className="p-demo-status">{message}</p>
            <div className="p-demo-saved">{patches.length ? patches.map(patch => <div key={patch.kind}><span>{patch.label}</span><button type="button" role="switch" aria-checked={patch.enabled} aria-label={`${patch.label} patch`} className="p-demo-switch" onClick={() => setPatches(previous => previous.map(item => item.kind === patch.kind ? { ...item, enabled: !item.enabled } : item))}><i /></button></div>) : <p>No patches for this site yet.<br />Choose a suggestion above to create one.</p>}</div>
            <div className="p-demo-master"><span>Patches on this page</span><button type="button" role="switch" aria-checked={enabled} aria-label="Enable patches on the sample page" className="p-demo-switch" onClick={() => setEnabled(!enabled)}><i /></button></div>
          </div>
        </aside>
        {!open && <button className="p-demo-reopen" type="button" onClick={() => setOpen(true)} aria-label="Open Patches demo sidebar"><LogoMark className="h-6 w-6" /></button>}
      </div>
    </div>
    <figcaption>Try it yourself · click a suggestion and watch this sample page change</figcaption>
  </figure>;
}
