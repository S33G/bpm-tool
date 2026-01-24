# GrooveLab

Musician utilities for timing, groove, and harmony.

GrooveLab is a modern, musician-friendly toolbox for timing and theory work. It includes BPM tools, groove quantization, rhythm grids, chord and scale exploration, visualizers, and setlist utilities.

## Features

- BPM to milliseconds calculator with tap tempo and delay suggestions
- Groove quantizer with swing grids and MIDI export
- Metronome, rhythm grid, and practice timer
- Chord generator, scale explorer, circle of fifths, and progression planner
- Keyboard and fretboard visualizers
- Pitch analyzer and MIDI analyzer
- Setlist builder with export options

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Tone.js (audio playback)
- @tonejs/midi (MIDI export)

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
