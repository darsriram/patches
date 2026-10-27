import { TypewriterPrompt } from "@/components/TypewriterPrompt";
import { LogoMark } from "@/components/Logo";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";

export function BetaCTA({ title = <>Own your <em>internet.</em></>, typewriter = false, copyColor }: { title?: React.ReactNode; typewriter?: boolean; copyColor?: string }) {
  return (
    <section className={`shared-beta ${typewriter ? "shared-beta-typewriter" : ""}`}>
      <InteractiveBackground tone="dark" draggable={false} />
      <Container>
        <ScrollReveal>
          {typewriter ? <><span className="closing-brand"><LogoMark className="h-12 w-12" /></span><h2>What would you<br /><em>patch first?</em></h2><TypewriterPrompt /></> : <><p className="patches-eyebrow">Make it yours</p><h2>{title}</h2></>}
          <p className="shared-beta-copy" style={copyColor ? { color: copyColor } : undefined}>Apply to test Patchy and share your feedback.</p>
          <div className="shared-beta-actions">
            <ButtonLink href="/beta">Apply for beta access <span aria-hidden="true">→</span></ButtonLink>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
