import { ScrollReveal } from "@/components/ScrollReveal";
import { useCases } from "@/lib/use-cases";

function UseCaseIllustration({ index }: { index: number }) {
  return <div className={`use-case-scene scene-${index}`} aria-hidden="true">
    <div className="scene-top"><i /><i /><i /><span /></div>
    {index === 0 ? <div className="scene-focus"><div><span>▶</span></div><aside><i /><i /><i /></aside></div>
    : index === 1 ? <div className="scene-research"><div><b /><i /><i /><i /><i /></div><aside><span>01</span><i /><span>02</span><i /></aside></div>
    : index === 2 ? <div className="scene-work"><aside><i /><i /><i /></aside><div><span>Reply</span><i /><i /><b>↗</b></div></div>
    : <div className="scene-access"><aside><i /><i /><i /></aside><div><strong>Aa</strong><i /><button tabIndex={-1}>Continue →</button></div></div>}
  </div>;
}

export function UseCaseList() {
  return (
    <ScrollReveal stagger className="patches-use-cases visual-use-cases">
      <div data-scroll-item className="use-case-section-heading"><p className="patches-eyebrow">For all the ways you use the web</p><h2>A different day. <em>A different patch.</em></h2><p>Make room for what you’re here to do.</p></div>
      <div className="patches-use-case-list">
        {useCases.map(([title, prompt], index) => <div data-scroll-item key={title}><UseCaseIllustration index={index} /><div className="use-case-card-copy"><span>0{index + 1}</span><h3>{title}</h3><p>“{prompt}”</p></div></div>)}
      </div>
      <p className="patches-use-case-note">Illustrative examples. Support varies by website and layout.</p>
    </ScrollReveal>
  );
}
