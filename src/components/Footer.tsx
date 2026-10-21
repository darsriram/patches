import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Container";
import { navLinks, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <Container className="flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between md:py-16">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">{site.slogan}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="nav-highlight nav-highlight-footer text-sm font-medium text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/beta"
                className="nav-highlight nav-highlight-footer text-sm font-medium text-primary hover:text-primary-hover"
              >
                Apply for beta access
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
