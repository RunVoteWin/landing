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

## Signup Form

The landing page reads `VITE_SIGNUP_ENDPOINT` at build time. Set it to a Google Apps Script web app URL that accepts this JSON payload:

```json
{
  "name": "Jane Organizer",
  "email": "jane@campaign.org",
  "source": "RunVoteWin landing page"
}
```

Until that endpoint is configured, the form renders normally but displays a connection-needed message on submit.

## Deployment

GitHub Pages is deployed by `.github/workflows/deploy-pages.yml`.

The Vite `base` option is set to `./` so the static build works from the custom domain root without hard-coded repository paths.

In GitHub Pages settings, the source should be **GitHub Actions**. Do not serve the repository root directly; that serves `src/main.tsx` instead of the static `dist` build and will fail in the browser.
