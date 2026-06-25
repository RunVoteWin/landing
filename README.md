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

The `vercel.json` rewrite keeps client-side routes such as `/win-for-life` working.

## Lead and Pricing Forms

The landing page posts lead, waitlist, and pricing form submissions to `VITE_SIGNUP_ENDPOINT`.

Use a Google Apps Script web app URL for that value. The Apps Script should handle the private work: appending to the lead sheet and optionally notifying Slack.

The checked-in Apps Script currently appends submissions to spreadsheet `1Ia8ppbMMQIlAv6Ep3Z8DbwHBHpmCNyzOZ7d8BYv_laQ`, sheet `Leads`.

The `/join-waitlist` page posts to `/api/waitlist/submit`, which forwards to the Apps Script endpoint server-side so it can display the waitlist position returned by the sheet automation. Launch waitlist positions start at `101`.

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

Launch waitlist payloads use:

```json
{
  "formType": "launch-waitlist",
  "name": "Jane Organizer",
  "email": "jane@campaign.org",
  "source": "RunVoteWin launch waitlist"
}
```

### Vercel environment variables

```txt
VITE_SIGNUP_ENDPOINT=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_WIN_FOR_LIFE_CHECKOUT_URL=https://buy.stripe.com/7sY00jf8Jehde2acL75ZC00
```

No Google Sheet IDs, Slack webhooks, or Google API credentials belong in this public repo.

## Win for Life Stripe Checkout

The `/win-for-life` page reads `VITE_WIN_FOR_LIFE_CHECKOUT_URL` at build time. Set it to the Stripe Payment Link or Checkout URL for the $10,000 Founding Victory Pass.

## Assets

The NGP VAN comparison logo is sourced from Wikimedia Commons: https://commons.wikimedia.org/wiki/File:NGPVAN_Logo.svg
