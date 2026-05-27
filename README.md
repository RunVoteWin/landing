# RunVoteWin Landing

Vite + React landing page for RunVoteWin.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

This site is intended to deploy on **Vercel**.

Recommended Vercel settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

The `vercel.json` rewrite keeps client-side routes such as `/win-for-life` working while leaving `/api/*` for Vercel Functions.

## Lead and Pricing Forms

The landing page posts to `VITE_SIGNUP_ENDPOINT`, defaulting to `/api/leads` on Vercel.

`/api/leads` safely handles:

- appending lead/pricing submissions to Google Sheets
- optional Slack notifications
- basic validation
- a hidden honeypot field for spam reduction

Example payload:

```json
{
  "formType": "pricing",
  "name": "Jane Organizer",
  "email": "jane@campaign.org",
  "role": "candidate",
  "campaignSize": "congressional",
  "estimateMonthly": 1250,
  "source": "RunVoteWin landing page"
}
```

### Vercel environment variables

Client-side:

```txt
VITE_SIGNUP_ENDPOINT=/api/leads
VITE_WIN_FOR_LIFE_CHECKOUT_URL=https://buy.stripe.com/YOUR_PAYMENT_LINK
```

Server-side for `/api/leads`:

```txt
LEADS_SHEET_ID=your_private_sheet_id
LEADS_SHEET_NAME=Leads
GOOGLE_SERVICE_ACCOUNT_EMAIL=runvotewin-leads@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SLACK_SIGNUP_WEBHOOK_URL=https://hooks.slack.com/services/...
```

Create a Google Cloud service account, enable the Google Sheets API, and share the target sheet with the service account email as an editor.

Slack stays safe because `SLACK_SIGNUP_WEBHOOK_URL` is read only by the Vercel Function. It is never exposed to the browser.

## Win for Life Stripe Checkout

The `/win-for-life` page reads `VITE_WIN_FOR_LIFE_CHECKOUT_URL` at build time. Set it to the Stripe Payment Link or Checkout URL for the $10,000 Founding Victory Pass.

If the variable is missing, the page falls back to a `mailto:` sales link and shows a small setup note.

## Assets

The NGP VAN comparison logo is sourced from Wikimedia Commons: https://commons.wikimedia.org/wiki/File:NGPVAN_Logo.svg
