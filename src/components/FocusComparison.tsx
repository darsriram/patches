export function FocusComparison() {
  return (
    <div className="focus-comparison brief-comparison">
      <div className="focus-comparison-label"><span>One project brief.</span><strong>Two ways to work with it.</strong></div>
      <div className="focus-comparison-pair">
        {[false, true].map(patched => <figure key={String(patched)} className={`focus-page ${patched ? "is-focused" : ""}`}><figcaption><span>{patched ? "Context beside the work" : "A long, linear page"}</span><span aria-hidden="true">{patched ? "↔" : "↓"}</span></figcaption><div className={`brief-layout ${patched ? "is-arranged" : ""}`}><div className="brief-main"><span>PROJECT BRIEF</span><h3>A workspace<br />that keeps up.</h3><p>Review the proposal while keeping its requirements close. The same page can support a different way of thinking.</p><div className="brief-task"><small>YOUR WORKING AREA</small><p>Outline the next iteration…</p></div></div><aside className="brief-requirements"><span>REQUIREMENTS</span><p><i />Keep navigation visible</p><p><i />Make instructions easy to scan</p><p><i />Leave room for notes</p><small>Existing information on this page</small></aside></div><p className="focus-annotation">{patched ? "The brief, working area, and requirements share the view." : "Requirements sit below the working area. Scroll to find them."}</p></figure>)}
      </div>
      <p className="comparison-disclaimer">Same information, rearranged · illustrated concept for a supported layout.</p>
    </div>
  );
}
