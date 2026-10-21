import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

type Interest = "beta";

type Payload = {
  firstName?: unknown;
  email?: unknown;
  school?: unknown;
  interest?: unknown;
  websites?: unknown;
  changes?: unknown;
  feedbackSession?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function optionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const firstName = isNonEmptyString(body.firstName)
    ? body.firstName.trim()
    : null;
  const email = isNonEmptyString(body.email) ? body.email.trim().toLowerCase() : null;
  const interest = body.interest === "beta" ? "beta" : null;
  const school = optionalString(body.school);
  const websites = optionalString(body.websites);
  const changes = optionalString(body.changes);
  const feedbackSession =
    body.feedbackSession === "yes" || body.feedbackSession === "no"
      ? body.feedbackSession
      : undefined;

  if (!firstName || !email || !interest) {
    return Response.json(
      { error: "First name, email, and interest are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (interest === "beta" && !feedbackSession) {
    return Response.json(
      { error: "Please tell us if you’d be open to a feedback session." },
      { status: 400 },
    );
  }

  const record = {
    firstName,
    email,
    school: school ?? null,
    interest: interest as Interest,
    websites: websites ?? null,
    changes: changes ?? null,
    feedbackSession: interest === "beta" ? feedbackSession : null,
    submittedAt: new Date().toISOString(),
  };

  const webhook = process.env.BETA_WEBHOOK_URL;

  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.BETA_WEBHOOK_TOKEN
            ? { Authorization: `Bearer ${process.env.BETA_WEBHOOK_TOKEN}` }
            : {}),
        },
        body: JSON.stringify(record),
        signal: AbortSignal.timeout(25000),
      });
      const acknowledgement = response.ok
        ? await response.json().catch(() => null)
        : null;
      if (!response.ok || acknowledgement?.stored !== true) {
        return Response.json(
          { error: "Could not save your application. Please try again." },
          { status: 502 },
        );
      }
      return Response.json({ ok: true, mode: "production" });
    } catch {
      return Response.json(
        { error: "Could not save your application. Please try again." },
        { status: 502 },
      );
    }
  }

  if (process.env.NODE_ENV !== "production") {
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "beta.jsonl"),
      `${JSON.stringify(record)}\n`,
      "utf8",
    );
    return Response.json({ ok: true, mode: "local-dev" });
  }

  return Response.json(
    {
      error:
        "Beta applications aren’t being collected yet. Delivery is not configured.",
    },
    { status: 503 },
  );
}
