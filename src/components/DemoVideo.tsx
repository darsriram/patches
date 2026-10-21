import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";

// Supply a local video URL and caption track when the product recording is ready.
export function DemoVideo({ src, captionsSrc }: { src?: string; captionsSrc?: string }) {
  return (
    <section id="demo-video" className="patches-video-section" aria-labelledby="demo-video-title">
      <Container>
        <ScrollReveal>
          <div className="patches-video-heading">
            <p className="patches-eyebrow">A quick look</p>
            <h2 id="demo-video-title">A small patch.<br className="sm:hidden" /> <em>A better page.</em></h2>
            <p>From a few words to a page that feels like yours.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal variant="zoom" className="patches-video-frame">
          {src ? (
            <video className="patches-demo-video" controls playsInline preload="none" aria-label="Patches product demo">
              <source src={src} type="video/mp4" />
              {captionsSrc && <track kind="captions" src={captionsSrc} srcLang="en" label="English" default />}
              Your browser does not support embedded video.
            </video>
          ) : (
            <div className="patches-video-placeholder">
              <div className="patches-video-window" aria-hidden="true"><span /><span /><span /><i /></div>
              <div className="patches-video-center">
                <span className="patches-video-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="5" width="13" height="14" rx="3" /><path d="m16 10 5-3v10l-5-3Z" /></svg></span>
                <p>See Patches in action.</p>
                <span>Demo video coming soon</span>
              </div>
              <div className="patches-video-timeline" aria-hidden="true"><span /><i /><span /></div>
            </div>
          )}
        </ScrollReveal>
      </Container>
    </section>
  );
}
