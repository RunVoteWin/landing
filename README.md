# RunVoteWin Landing Page

Landing page for RunVoteWin, a modern canvassing and voter data system for Democratic Party campaigns.

Live site: https://runvotewin.com/

## Development

Prerequisites:

- Node.js 22 or newer
- npm

Install dependencies:

```sh
npm install
```

Start the local development server:

```sh
npm run dev
```

Run type checking:

```sh
npm run lint
```

Build for production:

```sh
npm run build
```

## Lead and Pricing Forms

The landing page reads `VITE_SIGNUP_ENDPOINT` at build time. Set it to the Google Apps Script web app URL that accepts lead and pricing-estimate payloads, writes them to the RunVoteWin landing signups sheet, and optionally pings Slack from server-side script properties.

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

Until that endpoint is configured, the forms render normally but display a connection-needed message on submit.

## Win for Life Stripe Checkout

The `/win-for-life` page reads `VITE_WIN_FOR_LIFE_CHECKOUT_URL` at build time. Set it to the Stripe Payment Link or Checkout URL for the $10,000 Founding Victory Pass.

If the variable is missing, the page falls back to a `mailto:` sales link and shows a small setup note.

### Google Apps Script setup

1. Open the Google Sheet for leads: `https://docs.google.com/spreadsheets/d/1bp_UeAov4yln670kaII9_jV1JJw53wqKZlIAfa2rx08/edit`.
2. Go to **Extensions > Apps Script**.
3. Paste the contents of `automation/google-apps-script/pricing-leads.gs`.
4. In Apps Script, open **Project Settings > Script properties** and set optional server-side secrets:
   - `SLACK_SIGNUP_WEBHOOK_URL`: Slack incoming webhook URL for safe team pings. Never expose this in Vite/browser env vars.
   - `TEAM_NOTIFY_EMAIL`: optional internal email fallback.
   - `SEND_LEAD_EMAILS`: set to `true` only if requester confirmation/estimate emails should be sent from Apps Script.
5. Click **Deploy > New deployment**.
6. Choose **Web app**.
7. Set **Execute as** to **Me**.
8. Set **Who has access** to **Anyone**.
9. Deploy and copy the web app URL ending in `/exec`.
10. In GitHub, add a repository secret named `VITE_SIGNUP_ENDPOINT` with that `/exec` URL.
11. Re-run the GitHub Pages workflow or merge any change to rebuild the static site with the endpoint.

The front end sends `text/plain` JSON with `mode: no-cors` so Google Apps Script can receive submissions from GitHub Pages without a CORS preflight. Slack notification stays safe because only Apps Script reads `SLACK_SIGNUP_WEBHOOK_URL`; the browser never sees it. The script also uses a honeypot field, basic validation, duplicate throttling, and best-effort Slack notifications that never block sheet capture.

## Assets

The NGP VAN comparison logo is sourced from Wikimedia Commons: https://commons.wikimedia.org/wiki/File:NGPVAN_Logo.svg

## Deployment

GitHub Pages is deployed by `.github/workflows/deploy-pages.yml`.

The Vite `base` option is set to `./` so the static build works from the custom domain root without hard-coded repository paths.

In GitHub Pages settings, the source should be **GitHub Actions**. Do not serve the repository root directly; that serves `src/main.tsx` instead of the static `dist` build and will fail in the browser.
