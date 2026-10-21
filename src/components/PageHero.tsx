import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";

export function PageHero({ eyebrow, title, description, note }: { eyebrow: string; title: React.ReactNode; description: string; note: string }) {
  return (
    <section className="inner-hero">
      <Container>
        <ScrollReveal stagger>
          <div data-scroll-item className="inner-hero-top"><p className="patches-eyebrow">{eyebrow}</p><span>{note}</span></div>
          <h1 data-scroll-item>{title}</h1>
          <p data-scroll-item className="inner-hero-description">{description}</p>
        </ScrollReveal>
      </Container>
    </section>
  );
}
