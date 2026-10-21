import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        That link doesn’t exist. Head back to the homepage or apply for beta access.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/beta" variant="secondary">
          Apply for beta access
        </ButtonLink>
      </div>
    </Container>
  );
}
