import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BetaCTA } from "@/components/BetaCTA";

export const metadata: Metadata = { title: "About", description: "Patches is built around a belief: people should have more say in the interfaces they use every day." };

export default function AboutPage() {
  return (
    <div className="inner-page">
      <PageHero eyebrow="Why Patches exists" note="A LITTLE MORE SAY." title={<>The web is part of your life.<br /><em>You should have a say.</em></>} description="Our days happen across tabs. But the interfaces we use rarely reflect the people using them. We think there’s room for something more personal." />
      <section className="inner-section"><Container className="about-story-grid">
        <ScrollReveal><p className="patches-eyebrow">The belief</p><h2 className="inner-section-title">One layout.<br /><em>Countless people.</em></h2><p className="inner-section-copy">Some people want more space. Some need larger text. Some want fewer things asking for their attention. These aren’t edge cases — they’re different ways of being a person.</p><p className="inner-section-copy">Patches is our way of giving those preferences a place on the web. We want people to have more agency over the digital spaces they spend time in.</p></ScrollReveal>
        <ScrollReveal className="about-priority-board"><span>A MORE PERSONAL WEB</span><div><p>Attention.</p><p>Comfort.</p><p>Control.</p></div></ScrollReveal>
      </Container></section>
      <section className="about-manifesto"><Container><ScrollReveal><p className="patches-eyebrow">The bigger idea</p><h2>You shouldn’t have to<br /><em>work around the web.</em></h2><p>A useful interface makes room for the person on the other side of the screen. That’s the kind of web we want to help build.</p></ScrollReveal></Container></section>
      <section className="inner-section"><Container>
        <p className="patches-eyebrow">What we care about</p><h2 className="inner-section-title">Built around<br /><em>people, not defaults.</em></h2>
        <ScrollReveal stagger className="principle-list">{[
          ["01", "Personal choice", "There isn’t one perfect interface. What matters is whether it fits the person using it."],
          ["02", "Everyday comfort", "Reading, writing, and finding information should feel comfortable, whatever your preferences."],
          ["03", "Listening first", "The people using Patches should help shape its direction. Real needs are a better starting point than assumptions."],
        ].map(([n, title, copy]) => <article key={n} data-scroll-item><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</ScrollReveal>
      </Container></section>
      <section className="inner-section inner-tinted"><Container className="about-direction"><p className="patches-eyebrow">Where we’re starting</p><div><h2 className="inner-section-title">Close to the people<br /><em>who use it.</em></h2><p>Students are a useful starting point: their days move between research, course portals, applications, and everything in between. But the need for a more personal interface extends far beyond school.</p></div></Container></section>
      <BetaCTA copyColor="#292521" title={<>Your web.<br /><em>Your rules.</em></>} />
    </div>
  );
}
