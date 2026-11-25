# BIRTHDAY.EXE

A single-page arcade birthday invitation built with React and Vite. All interactions and game state run in the browser; there is no backend, database, authentication, or API key.

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Vite prints the local URL after the dev server starts.

## Production build

```bash
npm run build
npm run preview
```

The production site is written to `dist/`.

## Deploy to Vercel

Import this project into Vercel, or run `vercel` from the project directory. Vercel detects Vite automatically. The build command is `npm run build` and the output directory is `dist`.

## Notes

- The fly game uses elapsed wall-clock time, and the fly can only be caught after its first 30 seconds.
- The reaction test uses a random delay and `performance.now()` for its measurement.
- Google Maps opens a search for “Crossing Republic Indian Zaika”; no street address is assumed.
- Google Fonts are used when available, with local system fallbacks.
