"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { ButtonLink } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Container";
import { cn } from "@/lib/cn";
import { navLinks } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuId = useId();

  useEffect(() => {
    if (pathname !== "/") return;
    const update = () => {
      let current = "";
      for (const id of ["problem", "how-it-works"]) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= 160) current = id;
      }
      setActiveSection(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("hashchange", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("hashchange", update); };
  }, [pathname]);

  const isActive = (href: string) => href.includes("#")
    ? pathname === "/" && activeSection === href.split("#")[1]
    : pathname === href;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || open
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-background/40",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <Link href="/" className="relative z-10 rounded-lg" aria-label="Patches home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active =
              isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "nav-highlight",
                  active
                    ? "text-primary"
                    : "text-muted hover:text-ink",
                )}
                aria-current={active ? (link.href.includes("#") ? "location" : "page") : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="/beta" size="sm">
            Apply for beta access
          </ButtonLink>
        </div>

        <button
          type="button"
          className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span
            className={cn(
              "absolute h-0.5 w-4 rounded-full bg-ink transition-transform",
              open ? "translate-y-0 rotate-45" : "-translate-y-1.5",
            )}
          />
          <span
            className={cn(
              "absolute h-0.5 w-4 rounded-full bg-ink transition-opacity",
              open ? "opacity-0" : "opacity-100",
            )}
          />
          <span
            className={cn(
              "absolute h-0.5 w-4 rounded-full bg-ink transition-transform",
              open ? "translate-y-0 -rotate-45" : "translate-y-1.5",
            )}
          />
        </button>
      </Container>

      <div
        id={menuId}
        hidden={!open}
        className={cn(
          "border-t border-border bg-background md:hidden",
          open && "block",
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "nav-highlight rounded-xl px-3 py-3 text-base font-medium",
                  active ? "bg-lavender text-primary" : "text-ink",
                )}
                aria-current={active ? (link.href.includes("#") ? "location" : "page") : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <ButtonLink
            href="/beta"
            className="mt-3 w-full"
            onClick={() => setOpen(false)}
          >
            Apply for beta access
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}
