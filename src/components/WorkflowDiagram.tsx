import { LogoMark } from "@/components/Logo";

export function WorkflowDiagram({ title = <>A better interface starts with <em>a sentence.</em></> }: { title?: React.ReactNode }) {
  return (
    <section className="patches-workflow-diagram" aria-labelledby="workflow-title">
      <div data-scroll-item className="patches-diagram-heading"><p className="patches-eyebrow">How it works</p><h2 id="workflow-title" className="serif">{title}</h2><p>Describe the change. Review your patch. Keep your context.</p></div>
      <ol className="workflow-story">
        <li data-scroll-item><div className="workflow-words"><span>“Keep the references</span><strong>beside the article.”</strong><i aria-hidden="true" /></div><span className="workflow-story-number">01 / DESCRIBE</span><h3>Start with your intent.</h3><p>Say how you’d like the page to work.</p></li>
        <li data-scroll-item><div className="workflow-engine"><span aria-hidden="true" /><LogoMark className="h-12 w-12" /><span aria-hidden="true" /></div><span className="workflow-story-number">02 / PATCH</span><h3>Give the page a new shape.</h3><p>Patches adjusts the supported layout.</p></li>
        <li data-scroll-item><div className="workflow-result" aria-hidden="true"><div><i /><i /><i /></div><aside><i /><i /></aside></div><span className="workflow-story-number">03 / REVIEW</span><h3>Make the view yours.</h3><p>Review the change and keep browsing.</p></li>
      </ol>
      <p data-scroll-item className="patches-flow-note">Same website. Same information. A different arrangement.</p>
    </section>
  );
}
