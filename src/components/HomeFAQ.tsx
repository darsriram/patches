import { Container } from "@/components/Container";
import { Accordion } from "@/components/Accordion";

export function HomeFAQ() { return (
      <section className="inner-section how-faq"><Container className="faq-layout"><div><p className="patches-eyebrow">Before you get started</p><h2 className="inner-section-title">Frequently asked <em>questions.</em></h2><p className="inner-section-copy">What to know before joining the early beta.</p></div><div className="polished-faq">
            <Accordion
              items={[
                {
                  title: "What is Patches?",
                  content:
                    "Patches is an early-stage browser extension that lets you describe interface changes in plain English, then applies those changes to a supported website.",
                },
                {
                  title: "Who is the early beta for?",
                  content:
                    "People who want more control over the pages they use for work, study, research, or everyday browsing. Students are an initial focus, and we welcome other workflows too. Tell us which websites you’d like to customize when you apply.",
                },
                {
                  title: "Can I use it without coding?",
                  content:
                    "Yes. The intended workflow is a written instruction, not custom code.",
                },
                {
                  title: "Will it work on every website?",
                  content:
                    "No. Coverage is being tested, and beta feedback will help determine which sites and layouts to support first.",
                },
                {
                  title: "How can I help test it?",
                  content:
                    "Apply for beta access. We’ll email you about testing as the product is ready for more people to try.",
                },
                {
                  title: "What information does this website collect?",
                  content:
                    "The beta application form collects the details you submit so we can contact you about access and testing. This marketing site does not describe how the browser extension will handle browsing data.",
                },
              ]}
            />
        <div className="technical-accordion"><Accordion items={[{ title: "The technical version", content: "Patches can change a supported page’s styling, layout, and underlying page content in your browser. That includes hiding sections, adjusting spacing, highlighting information, restructuring layouts, and adding or changing page elements and content. These changes apply to your browser’s version of the page; they don’t modify the website’s server or source files." }]} /></div>
      </div></Container></section>
); }
