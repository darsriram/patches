import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";
import "./globals.css";
import "./motion.css";
import "@/components/WorkflowDiagram.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.trypatchy.me"),
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.slogan}`,
    description: site.description,
    images: [{ url: "/patchy-share-orange.png", width: 1200, height: 630, alt: "Patchy orange logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.slogan}`,
    description: site.description,
    images: ["/patchy-share-orange.png"],
  },
  title: {
    default: `${site.name} — ${site.slogan}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  icons: { icon: { url: "/patches-favicon-orange.svg", type: "image/svg+xml" }, apple: "/patches-icon-orange.png" },
};

function HeaderFallback() {
  return (
    <div className="h-16 border-b border-transparent lg:h-[4.5rem]">
      <Container className="flex h-full items-center">
        <Logo />
      </Container>
    </div>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-ink">
        <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute", pointerEvents: "none" }}>
          <defs>
            <filter id="patches-logo-transparent" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 0 3" />
              <feComposite operator="in" in2="SourceGraphic" />
            </filter>
            <filter id="patches-logo-brand" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 0 3" />
              <feComposite operator="in" in2="SourceGraphic" result="logoMask" />
              <feFlood floodColor="#ff7043" />
              <feComposite operator="in" in2="logoMask" />
            </filter>
          </defs>
        </svg>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Suspense fallback={<HeaderFallback />}>
          <Header />
        </Suspense>
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
