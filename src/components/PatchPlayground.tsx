"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useCases } from "@/lib/use-cases";
import { LogoMark } from "@/components/Logo";

const descriptions = ["Organize your session into two carts", "Organize movies into watch-later collections", "Build a follow-up list", "Remove distractions"];
const urls = ["Amazon · shopping concept", "Netflix · collections concept", "Gmail · follow-up concept", "YouTube · focus concept"];
type Stage = "before" | "applying" | "after";

export function PatchPlayground() {
  const [active, setActive] = useState(0);
  const [cart, setCart] = useState<Record<number, 1 | 2>>({});
  const [collections, setCollections] = useState<Record<number, string>>({});
  const [followUps, setFollowUps] = useState<number[]>([]);
  const [stage, setStage] = useState<Stage>("before");
  const id = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const patched = stage === "after";
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function select(index: number) {
    if (timer.current) clearTimeout(timer.current);
    setActive(index);
    setStage("before");
  }
  function apply() {
    if (stage === "applying") return;
    if (patched) { setStage("before"); return; }
    setStage("applying");
    timer.current = setTimeout(() => { setStage("after"); timer.current = null; }, 450);
  }

  return (
    <div className="patch-lab" data-no-background-drag>
      <div className="patch-lab-tabs" role="tablist" aria-label="Customization examples" aria-orientation="vertical">
        {useCases.map(([title], index) => <button ref={element => { tabs.current[index] = element; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={active === index} aria-controls={`${id}-preview`} tabIndex={active === index ? 0 : -1} key={title} onClick={() => select(index)} onKeyDown={event => {
          let next = index;
          if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % useCases.length;
          else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index + useCases.length - 1) % useCases.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = useCases.length - 1;
          else return;
          event.preventDefault(); select(next); tabs.current[next]?.focus();
        }}><span className="patch-lab-tab-number">0{index + 1}</span><span><strong>{title}</strong><small>{descriptions[index]}</small></span><span aria-hidden="true">↗</span></button>)}
        <p className="patch-lab-caption">Pick a task. Try a patch.<br />See what changes.</p>
      </div>
      <div className="patch-lab-panel" id={`${id}-preview`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0}>
        <div className="patch-lab-browser"><span aria-hidden="true">● ● ●</span><span>{urls[active]}</span><strong>{patched ? "Patched view" : "Original view"}</strong></div>
        <div className={`patch-lab-scene scene-${active} ${patched ? "is-patched" : ""}`} aria-busy={stage === "applying"}>
          {active === 0 && <ShoppingScene patched={patched} carts={cart} setCarts={setCart} />}
          {active === 1 && <MovieScene patched={patched} collections={collections} setCollections={setCollections} />}
          {active === 2 && <MailScene patched={patched} saved={followUps} setSaved={setFollowUps} />}
          {active === 3 && <VideoScene patched={patched} />}
        </div>
        <div className="patch-lab-command"><div className="patch-lab-command-title"><LogoMark className="h-6 w-6" /><strong>Patches</strong><span aria-live="polite">{stage === "applying" ? "Applying preview…" : patched ? "Preview patch applied" : "Try this request"}</span></div><p>“{useCases[active][1]}”</p><div className="patch-lab-command-bottom"><span>Interactive illustration · not your live browser</span><button type="button" onClick={apply} disabled={stage === "applying"}>{stage === "applying" ? "Applying…" : patched ? "Reset preview ↺" : "Apply preview patch →"}</button></div></div>
      </div>
      <p className="patch-lab-disclaimer">Interactive concepts with sample content, not live integrations or claims of current availability. Saved items stay in this preview while you switch examples. These websites are not affiliated with Patches.</p>
    </div>
  );
}

type SavedProps = { patched: boolean; saved: number[]; setSaved: (value: number[]) => void };
const products = [{ name: "Wireless headphones", price: 59, symbol: "◉" }, { name: "Desk lamp", price: 28, symbol: "◒" }, { name: "Notebook set", price: 12, symbol: "▤" }];
function ShoppingScene({ patched, carts, setCarts }: { patched: boolean; carts: Record<number, 1 | 2>; setCarts: (value: Record<number, 1 | 2>) => void }) {
  const assign = (index: number, value: string) => {
    const next = { ...carts };
    if (value === "none") delete next[index];
    else next[index] = value === "1" ? 1 : 2;
    setCarts(next);
  };
  return <><div className="scene-site-title">Amazon <span>SESSION CARTS CONCEPT</span></div><div className={`shopping-concept ${patched ? "with-cart" : ""}`}><div className="sample-products">{products.map((product,index) => <article key={product.name}><div aria-hidden="true">{product.symbol}</div><strong>{product.name}</strong><span>${product.price.toFixed(2)}</span>{patched && <select aria-label={`Cart for ${product.name}`} value={carts[index] ?? "none"} onChange={event => assign(index,event.target.value)} style={{ border: "1px solid #c6b8b0", borderRadius: 5, padding: 5, fontSize: 10, background: "#f7f5f3", color: "#6b5446", maxWidth: "100%" }}><option value="none">Choose a cart</option><option value="1">Cart 1</option><option value="2">Cart 2</option></select>}</article>)}</div>{patched && <aside className="shopping-later"><span className="scene-kicker">THIS SHOPPING SESSION</span>{([1,2] as const).map(cartId => {
    const items = products.map((product,index) => ({ ...product,index })).filter(product => carts[product.index] === cartId);
    return <section key={cartId} style={{ marginTop: 16 }}><strong style={{ fontSize: 12 }}>Cart {cartId}</strong>{items.length ? items.map(product => <div key={product.index} style={{ fontSize: 10, paddingBlock: 9, borderBottom: "1px solid #efeae7" }}>{product.name} · ${product.price.toFixed(2)}</div>) : <p style={{ fontSize: 10, marginTop: 8 }}>No products yet.</p>}<div className="shopping-total" role="status" aria-label={`Cart ${cartId} total`}>Total <strong>${items.reduce((sum,product) => sum + product.price,0).toFixed(2)}</strong></div></section>;
  })}</aside>}</div><span className="scene-result">{patched ? "Sort products into Cart 1 or Cart 2. Moving a product updates both totals for this session." : "A shopping page before adding your own session-based cart organization."}</span></>;
}

const movies = ["The Last Light", "A Sunday Somewhere", "Small Wonders"];
const collectionNames = ["Weekend", "With friends", "Quick watches"];
function MovieScene({ patched, collections, setCollections }: { patched: boolean; collections: Record<number, string>; setCollections: (value: Record<number, string>) => void }) {
 return <><div className="scene-site-title">Netflix <span>WATCH-LATER COLLECTIONS CONCEPT</span></div><div className={`shopping-concept ${patched ? "with-cart" : ""}`}><div className="sample-products">{movies.map((movie, index) => <article key={movie}><div aria-hidden="true">{["◐", "✳", "◈"][index]}</div><strong>{movie}</strong><span>Sample movie</span>{patched && <select aria-label={`Collection for ${movie}`} value={collections[index] ?? ""} onChange={event => setCollections({ ...collections, [index]: event.target.value })} style={{ width: "100%", padding: 6, border: "1px solid #e5cbbd", borderRadius: 6, fontSize: 10, background: "#fff8f3" }}><option value="">Save to collection</option>{collectionNames.map(name => <option key={name}>{name}</option>)}</select>}</article>)}</div>{patched && <aside className="shopping-later" aria-live="polite"><span className="scene-kicker">MY WATCH-LATER COLLECTIONS</span>{collectionNames.map(name => <section key={name} style={{ marginTop: 16 }}><strong style={{ fontSize: 12 }}>{name}</strong>{movies.filter((_, index) => collections[index] === name).map(movie => <p key={movie} style={{ fontSize: 11, marginTop: 8 }}>{movie}</p>)}{!Object.values(collections).includes(name) && <p style={{ fontSize: 10, marginTop: 8 }}>No movies yet.</p>}</section>)}</aside>}</div><span className="scene-result">{patched ? "Choose a collection for each movie. Move it between sections whenever your plans change." : "One browsing view. Your own watch-later sections have not been added yet."}</span></>;
}
function VideoScene({ patched }: { patched: boolean }) {
 return <><div className="scene-site-title">YouTube <span>FOCUS LAYOUT CONCEPT</span></div><div className="video-search">Search videos <span aria-hidden="true">⌕</span></div><div className="video-concept"><nav aria-label="Illustrated subscriptions"><strong>Subscriptions</strong><span>Design Journal</span><span>Science Studio</span><span>Everyday Ideas</span></nav><div className="video-main"><div className="sample-video"><span aria-hidden="true">▷</span><strong>Ideas worth a closer look</strong></div>{!patched && <div className="video-comments">Comments <p>Join the conversation…</p></div>}</div>{!patched && <aside className="video-distractions"><strong>Recommended</strong><div /><div /><strong>Shorts</strong><div /></aside>}</div><span className="scene-result">{patched ? "Video, search, and subscriptions stay. Recommendations, Shorts, and comments are hidden. Saved-layout concept." : "Recommendations, Shorts, and comments surround the video."}</span></>;
}
const messages = [{ from: "Jordan", subject: "Project proposal", body: "Can you share your thoughts on the proposal before Friday?" }, { from: "Morgan", subject: "Coffee next week?", body: "Would Tuesday afternoon work for a catch-up?" }, { from: "Design team", subject: "Feedback on the first draft", body: "The first draft is ready. We’d love your feedback on the layout." }];
function MailScene({ patched, saved, setSaved }: SavedProps) {
 const [selected, setSelected] = useState<number | null>(null);
 return <><div className="scene-site-title">Gmail <span>FOLLOW-UP PANEL CONCEPT</span></div><div className={`mail-concept ${patched ? "with-followups" : ""}`}><div><span className="scene-kicker">INBOX</span>{messages.map((message,index) => <div className="sample-message" key={message.subject}><button type="button" onClick={() => setSelected(index)}><strong>{message.from}</strong><span>{message.subject}</span></button>{patched && <button className="save-followup" type="button" aria-label={`${saved.includes(index) ? "Remove" : "Save"} ${message.subject} ${saved.includes(index) ? "from" : "to"} follow-ups`} aria-pressed={saved.includes(index)} onClick={() => setSaved(saved.includes(index) ? saved.filter(item => item !== index) : [...saved,index])}>{saved.includes(index) ? "✓ Saved" : "+ Follow up"}</button>}</div>)}{selected !== null && <article className="opened-message"><strong>{messages[selected].subject}</strong><p>{messages[selected].body}</p></article>}</div>{patched && <aside className="mail-followups"><span className="scene-kicker">MY FOLLOW-UPS · {saved.length}</span>{saved.length ? saved.map(index => <button type="button" key={index} onClick={() => setSelected(index)}><strong>{messages[index].from}</strong><span>{messages[index].subject} ↗</span></button>) : <p>Save a conversation to keep it here.</p>}</aside>}</div><span className="scene-result">{patched ? "Save a conversation, then click it in your follow-up panel to reopen it." : "Conversations share one inbox, with no dedicated follow-up panel."}</span></>;
}
