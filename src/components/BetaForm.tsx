"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";

type Interest = "beta";
type Feedback = "yes" | "no" | "";

type FieldErrors = Partial<
  Record<"firstName" | "email" | "interest" | "feedbackSession", string>
>;

type SubmitMode = "production" | "local-dev";

export function BetaForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const interest: Interest = "beta";
  const [websites, setWebsites] = useState("");
  const [changes, setChanges] = useState("");
  const [feedbackSession, setFeedbackSession] = useState<Feedback>("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    interest: Interest;
    mode: SubmitMode;
  } | null>(null);

  const buttonLabel =
    "Apply for beta access";

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-muted/70";

  const validate = useMemo(
    () => () => {
      const next: FieldErrors = {};
      if (!firstName.trim()) next.firstName = "Enter your first name.";
      if (!email.trim()) next.email = "Enter your email.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        next.email = "Enter a valid email address.";
      }
      if (interest === "beta" && !feedbackSession) {
        next.feedbackSession = "Please choose yes or no.";
      }
      return next;
    },
    [email, feedbackSession, firstName, interest],
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          school: school.trim() || undefined,
          interest,
          websites: websites.trim() || undefined,
          changes: changes.trim() || undefined,
          feedbackSession:
            interest === "beta" ? feedbackSession : undefined,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        mode?: SubmitMode;
      };

      if (!response.ok) {
        setFormError(
          data.error ?? "Something went wrong. Please try again.",
        );
        return;
      }

      setResult({
        interest,
        mode: data.mode === "local-dev" ? "local-dev" : "production",
      });
    } catch {
      setFormError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div
        className="rounded-2xl border border-border bg-white p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Beta application
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
          Application received.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-muted">
          We’ll review your application and reach out about testing.
        </p>
        {result.mode === "local-dev" ? (
          <p className="mx-auto mt-4 max-w-sm rounded-xl bg-lavender px-3 py-2 text-sm text-ink">
            Local development only: this application was saved on this machine.
            Production beta application delivery is not configured.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-border bg-white p-5 shadow-[0_20px_50px_-32px_rgba(53,43,37,0.35)] sm:p-7"
    >
      <div className="space-y-5">
        <Field
          id="firstName"
          label="First name"
          required
          error={errors.firstName}
        >
          <input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className={cn(fieldClass, errors.firstName && "border-primary")}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
          />
        </Field>

        <Field id="email" label="Email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={cn(fieldClass, errors.email && "border-primary")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </Field>

        <Field id="school" label="School or organization">
          <input
            id="school"
            name="school"
            autoComplete="organization"
            value={school}
            onChange={(event) => setSchool(event.target.value)}
            className={fieldClass}
          />
        </Field>

        {interest === "beta" ? (
          <fieldset>
            <legend className="text-sm font-medium text-ink">
              Would you be open to a short feedback session?{" "}
              <span className="text-primary" aria-hidden="true">
                *
              </span>
              <span className="sr-only">required</span>
            </legend>
            <div className="mt-2 flex gap-2">
              {(
                [
                  ["yes", "Yes"],
                  ["no", "No"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={cn(
                    "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm",
                    feedbackSession === value
                      ? "border-primary bg-lavender"
                      : "border-border bg-white",
                  )}
                >
                  <input
                    type="radio"
                    name="feedbackSession"
                    value={value}
                    checked={feedbackSession === value}
                    onChange={() => setFeedbackSession(value)}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
            {errors.feedbackSession ? (
              <p
                id="feedbackSession-error"
                className="mt-1.5 text-sm text-primary"
                role="alert"
              >
                {errors.feedbackSession}
              </p>
            ) : null}
          </fieldset>
        ) : null}

        <Field
          id="websites"
          label="Which websites would you most like to customize?"
        >
          <input
            id="websites"
            name="websites"
            value={websites}
            onChange={(event) => setWebsites(event.target.value)}
            className={fieldClass}
            placeholder="Course portals, research sites, application forms…"
          />
        </Field>

        <Field id="changes" label="What would you change about them?">
          <textarea
            id="changes"
            name="changes"
            rows={4}
            value={changes}
            onChange={(event) => setChanges(event.target.value)}
            className={cn(fieldClass, "resize-y min-h-[6.5rem]")}
          />
        </Field>
      </div>

      {formError ? (
        <p className="mt-4 text-sm text-primary" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit" className="mt-6 w-full" disabled={submitting}>
        {submitting ? "Sending…" : buttonLabel}
      </Button>
      <p className="mt-3 text-center text-sm text-muted">
        We’ll email you about Patches access and beta testing.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? (
          <>
            {" "}
            <span className="text-primary" aria-hidden="true">
              *
            </span>
            <span className="sr-only">required</span>
          </>
        ) : (
          <span className="font-normal text-muted"> (optional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
