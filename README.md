# Blue North Landing Page

Landing page for Blue North, built with Vite, React, Tailwind CSS, Motion, and Lucide icons.

Live site: https://runvotewin.github.io/landing/

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

## Deployment

GitHub Pages is deployed by `.github/workflows/deploy-pages.yml`.

The Vite `base` option is set to `/landing/` because this site is served from the `RunVoteWin/landing` repository path.
