# BPM Toolbox

A modern, musician-friendly toolbox for timing and groove: swing timing visualization, delay time calculation, groove grids, and MIDI export.

## Features

- Groove quantization visualizer with swing presets
- Delay time calculator for synced effects
- MIDI export for straight, swing, and triplet grids
- Clean, responsive UI built with Next.js and Tailwind CSS

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Tone.js (for audio playback)
- @tonejs/midi (for MIDI export)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - build the app
- `npm run start` - run the production server
- `npm run lint` - run ESLint

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow that exports a static build to GitHub Pages on pushes to `main`.

1. In GitHub repo settings, set **Pages** > **Source** to **GitHub Actions**.
2. Push to `main` to trigger the deployment.

If your default branch is not `main`, update the workflow trigger in `.github/workflows/deploy.yml`.

## Project Structure

- `src/components` - UI components
- `src/lib` - timing math, audio playback, and MIDI helpers
- `src/app` - application routes

## License

MIT
