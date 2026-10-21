# Patches

Marketing site for **Patches**, an early-stage browser extension that lets people customize website interfaces in plain English. The site recruits early beta testers and collects beta applications.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

## Routes

- `/` — landing page
- `/problem` — the problem Patches addresses
- `/how-it-works` — product explanation
- `/about` — mission and product direction
- `/beta` — beta application; `/waitlist` redirects here

## Beta application backend

The form posts JSON to `POST /api/beta`.

Required fields: `firstName`, `email`, `interest` (`beta` only).  
Optional: `school`, `websites`, `changes`.  
When `interest` is `beta`, `feedbackSession` must be `yes` or `no`.

### Production

Set a webhook so submissions are actually delivered:

```bash
BETA_WEBHOOK_URL=https://example.com/your-beta-endpoint
BETA_WEBHOOK_TOKEN=optional-bearer-token
```

Copy `.env.example` to `.env.local` and fill in values. Do not put secrets in client-side code.

The webhook must return HTTP 2xx with JSON `{"ok":true,"stored":true}` only after the application has been saved. The server waits up to 25 seconds and treats missing storage acknowledgement as an error.

The API sends:

```json
{
  "firstName": "Jordan",
  "email": "jordan@example.edu",
  "school": "Example University",
  "interest": "beta",
  "websites": "Course portal, research articles",
  "changes": "Highlight deadlines",
  "feedbackSession": "yes",
  "submittedAt": "2026-10-15T00:00:00.000Z"
}
```

If `BETA_WEBHOOK_URL` is missing in production, the API returns HTTP 503. The form shows an error instead of a fake success.

### Local development without a webhook

When `NODE_ENV` is not `production` and no webhook is set, submissions are appended to:

`.data/beta.jsonl`

The success screen is labeled as local development only.

## Stack

Next.js, TypeScript, Tailwind CSS.

## Make + Brevo delivery

The Make scenario **Patches — Beta applications** receives the webhook, creates or updates the Brevo contact in **Patches Beta** (list 4), then responds with the storage acknowledgement. Application answers are mapped to `FIRSTNAME`, `BETA_SCHOOL`, `BETA_WEBSITES`, `BETA_CHANGES`, `BETA_FEEDBACK`, and `BETA_SUBMITTED_AT`. Existing email addresses are updated.

Brevo automation **Patches — Beta application confirmation** sends an application receipt after one minute. Re-entry is disabled. Sender and reply-to: `patches.browser@gmail.com`. The receipt does not grant beta access.

For deployment, copy the server-only `BETA_WEBHOOK_URL` into the hosting provider environment and redeploy. Local environment files are ignored by Git. Manage the dedicated Brevo key in Make; it expires after one year or 90 days of inactivity according to Brevo.

## Google Sheets application log

Make also appends each submitted application to the `Applications` tab in [Patches Beta Applications](https://docs.google.com/spreadsheets/d/1Zuops3WUYCpEMkHOveetmMl-5fW8QGjoAC_ltufxePc/edit). Columns contain submitted-at UTC, first name, email, school or organization, websites, requested changes, and feedback session preference. The sheet logs each submission, including repeat applications. Brevo continues to update existing contacts by email and sends only one application receipt.

The Google Sheets module runs after the successful Brevo storage response, so email delivery remains independent of spreadsheet logging. Check Make execution history for spreadsheet delivery errors. The dedicated Google connection is managed in Make.
