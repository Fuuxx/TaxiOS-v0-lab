# TaxiOS v0 Lab

Standalone Next.js reference project for reconstructing the current TaxiOS Company Dashboard in v0.

Start with [`README_START_HERE.md`](./README_START_HERE.md).

## Run Locally

```bash
pnpm install
pnpm dev
```

Open:

- `http://localhost:3000` for the dashboard baseline
- `http://localhost:3000/reference` for reference screenshots

## Build

```bash
pnpm build
```

The project uses `output: "export"` in `next.config.mjs`, so `pnpm build` writes a static export to `out/`.

## Deploy To Vercel

1. Create a new Vercel project from this repository.
2. Framework preset: Next.js.
3. Build command: `pnpm build`.
4. Output directory: `out`.
5. No environment variables are required.

This lab has no backend, no secrets, no Convex, and no Clerk.

## Connect To v0

Recommended workflow:

1. Open this repository in v0.
2. Tell v0 to read `README_START_HERE.md` first.
3. Ask v0 to inspect `app/page.tsx`, `styles/taxis-tokens.css`, and `public/reference`.
4. Ask v0 to list visual mismatches before editing.
5. Allow v0 to fix one mismatch at a time.
6. Do not ask for premium polish until the baseline is close to the reference screenshots.

Prompt starter:

```text
Read README_START_HERE.md first.
This is a reconstruction lab, not a redesign task.
Compare app/page.tsx against public/reference/company-dashboard-screen.png.
List the mismatches before editing.
Fix only the highest-impact mismatch.
Do not add premium polish yet.
```
