# Mummy's List V1

## Run locally

1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Open the VS Code terminal.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL Vite prints in the terminal.

## Build for Vercel

```bash
npm run build
```

The production output is the `dist` folder.

## Important

This is the frontend milestone. Data is stored in the browser with localStorage.

The "live" behavior works between browser tabs on the same device using BroadcastChannel/storage events.

It is NOT yet true cross-device sharing.

The next backend milestone should move:
- shopping lists
- list items
- remarks
- completed state
- list membership
- authentication

to Supabase.

The uploaded brief explicitly names "Dry foods & cooking ingredients" and "Home Essentials", but does not enumerate the individual products under those headings. Do not invent those products. Add the exact lists when provided.
