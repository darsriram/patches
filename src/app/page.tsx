import { BetaCTA } from "@/components/BetaCTA";
import { HomeFAQ } from "@/components/HomeFAQ";
import { DemoVideo } from "@/components/DemoVideo";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { SidebarPreview } from "@/components/SidebarPreview";
import { PatchField } from "@/components/PatchField";

export default function Home() {
  return (
    <div className="patches-landing">
      <section className="patches-hero">
        <PatchField />
        <Container className="patches-heroContent patches-product-hero">
          <div className="patches-hero-copy" data-motion-group>
          <p className="patches-eyebrow">Your web. Your way.</p>
          <h1 className="patches-headline">Make every website<br />work <em>your way.</em></h1>
          <p className="patches-description">
            Tell Patches what to change. Make the page yours.
          </p>
          <div className="patches-actions">
            <ButtonLink href="/beta">Apply for beta access <span aria-hidden="true">→</span></ButtonLink>
            <ButtonLink href="/#how-it-works" variant="secondary">See how it works</ButtonLink>
          </div>
          </div>
          <SidebarPreview />
        </Container>
      </section>

      <DemoVideo src="/videos/patches-product-demo-full-frame.mp4" captionsSrc="/videos/patches-product-demo-22s.vtt" />

      <section id="problem" className="patches-overview home-anchor" aria-labelledby="problem-heading">
        <Container>
          <p className="patches-eyebrow">A web that fits you</p>
          <ScrollReveal stagger className="patches-overview-intro overview-story">
            <h2 id="problem-heading" data-scroll-item>Websites are built for everyone. <em>Yours should work for you.</em></h2>
            <div data-scroll-item>
              <p>The same layout. The same clutter. Millions of different people. Patches lets you reshape websites around what you need.</p>
              <div className="layout-comparison" role="img" aria-label="Before: article squeezed between menus and updates. After: a wide article with references grouped below and navigation in a compact top bar.">
                <div className="layout-mini layout-mini-before" aria-hidden="true"><span className="layout-mini-label">BEFORE</span><div className="layout-mini-browser"><div className="layout-mini-top">Menu · News · Updates</div><div className="layout-mini-scattered"><aside>Links<i /><i /><i /></aside><article><b>Article</b><i /><i /><i /></article><aside>Updates<i /><i /></aside><section>References scattered below<i /></section></div></div></div>
                <span className="layout-mini-arrow" aria-hidden="true">→</span>
                <div className="layout-mini layout-mini-after" aria-hidden="true"><span className="layout-mini-label">YOUR VIEW</span><div className="layout-mini-browser"><div className="layout-mini-top">Reading <span>Navigation ↗</span></div><article><b>Room for the whole idea.</b><i /><i /><i /></article><section><strong>Sources, together</strong><div><span>01 Reference</span><span>02 Reference</span></div></section></div></div>
              </div><p className="personal-layouts-caption">Same page. A layout that fits.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal stagger className="home-friction-strip">
            {[["01", "Competing priorities", "What matters to you gets lost among everything else."], ["02", "Different tabs, different rules", "Every new layout asks you to adjust again."], ["03", "Too much effort to customize", "A small interface change shouldn’t require code."]].map(([n,title,copy]) => <article data-scroll-item key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </ScrollReveal>
        </Container>
      </section>
      <section id="how-it-works" className="home-how home-anchor" aria-labelledby="workflow-title"><Container><WorkflowDiagram /></Container></section>
      <section className="home-direction"><Container><div data-motion-group><p className="patches-eyebrow">Product direction</p><h2 className="inner-section-title">A more personal web, <em>one patch at a time.</em></h2></div><div className="home-direction-details" data-motion-group><article><span>Current focus</span><p>CSS-based interface changes and saved website-specific preferences on supported pages.</p></article><article><span>Planned</span><p>Broader personalization and community-created patches.</p></article></div></Container></section>
      <HomeFAQ />
      <BetaCTA typewriter />
    </div>
  );
}
