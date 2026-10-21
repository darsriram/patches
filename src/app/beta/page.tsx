import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { BetaForm } from "@/components/BetaForm";
import { SidebarEntrance } from "@/components/SidebarEntrance";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = { title: "Apply for beta access", description: "Apply to test the Patches early beta and share your feedback." };

function FormFallback() {
  return <div className="signup-form-loading" role="status"><span>Loading the signup form…</span></div>;
}

export default function BetaPage() {
  return (
    <section className="signup-page" style={{ overflowX: "clip" }}>
      <Container className="signup-layout">
        <div className="signup-intro">
          <p className="patches-eyebrow">Your next little improvement</p>
          <h1>Your web.<br /><em>Your way.</em></h1>
          <p>Apply to test the Patches early beta and help shape what comes next.</p>
          <div className="signup-brand-panel"><InteractiveBackground tone="dark" draggable={false} /><LogoMark className="h-12 w-12" /><p>A page that<br /><em>feels like yours.</em></p><span>LESS CLUTTER. MORE CONTROL.</span></div>
          <div className="signup-expectations"><span>What happens next</span><p>We’ll email you about access and testing. Applying for the beta helps us learn how you’d use Patches.</p></div>
        </div>
        <SidebarEntrance className="signup-form-wrap"><div className="signup-form-heading"><span className="signup-form-dot" /><p>Beta application</p><span>EARLY ACCESS</span></div><Suspense fallback={<FormFallback />}><BetaForm /></Suspense></SidebarEntrance>
      </Container>
    </section>
  );
}
