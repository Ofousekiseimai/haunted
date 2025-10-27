## Completed (Session)
- Bootstrapped `next-app/` with Next 16 App Router and wired shared data loaders for Laografia articles and subcategories (`lib/laografia.ts`).
- Replaced the scaffolded layout with the production header/footer shell, full metadata defaults, and dark theme fonts (`app/layout.tsx`, `components/layout/header.tsx`, `components/layout/footer.tsx`).
- Ported core design tokens, typography utilities, and spacing helpers from the Vite Tailwind setup into `app/globals.css`.
- Migrated Laografia index, subcategory, and article pages to use the shared Section layout and legacy styling patterns.
- Ported the home landing experience: hero banner, category spotlights powered by deterministic article sampling, and YouTube showcase (`app/page.tsx`, `components/home/*`, `lib/home.ts`, `lib/youtube.ts`).

## In Progress / Next
- Mirror the remaining Vite routes in Next (Efimerides, Εταιρεία Ψυχικών Ερευνών index, About/Terms/Privacy, Prosopa/Έντυπα if applicable) with metadata and JSON-LD parity.
- Extract additional shared UI blocks (Sidebar, Search, RandomArticles, Footer callouts) and align typography where the old app had bespoke wrappers.
- Bring over interactive client components (maps via Leaflet, search interactions, scroll helpers) with client/server boundaries and hydration guards.
- Implement GA4 analytics plus any behavioural scripts once the main routes are ported.
- Set up CI tasks (`next build`, lint) and deployment workflow to replace the Vite build when parity is achieved.
