# inovix-store — Next.js Storefront

This is the Next.js storefront for Inovix, an EU peptide research e-commerce store.

## Tech Stack
- Next.js 16+ (App Router), TypeScript, Tailwind CSS
- Medusa JS SDK for all backend communication
- Deploys to Vercel

## Backend
- Medusa.js v2 backend at `http://localhost:9000` (development)
- Production URL will be set via `NEXT_PUBLIC_MEDUSA_BACKEND_URL` env var
- **Always use the Medusa JS SDK (`src/lib/medusa.ts`) for API calls — never use raw `fetch` directly against the backend**

## Environment Variables
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` — Medusa backend URL (defaults to http://localhost:9000)
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` — Medusa publishable API key (required in production)

## Compliance Requirements
- **All pages showing products must include a "Research Use Only" disclaimer** — this is a legal requirement for EU peptide sales
- EU cookie consent and privacy policy are mandatory
- Never market products for human use
- No age verification gate (removed by design decision)

## Design Guidelines
- Modern, clean, medical/scientific aesthetic
- Mobile-first responsive design
- Minimal color palette; trust-building UI
- Prefer readable, accessible layouts over flashy visuals

## Code Conventions
- Server Components by default; only add `'use client'` when interactivity is needed
- All async params/searchParams must be awaited (Next.js 15+)
- Use `next/image` for all images
- Use `next/link` for all internal navigation
- Product data always comes from Medusa SDK; never hardcode products
