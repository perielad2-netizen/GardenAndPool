# מים וטבע (Garden & Pool)

## Overview
- Platform: Cloudflare Pages + Workers (Hono)
- Frontend: Tailwind (CDN), Heebo (RTL), FontAwesome, vanilla JS (public/static/app.js)
- Backend: Hono routes with API stubs, Supabase integration planned (Auth, profiles, appointments, subscriptions, invoices, notifications, storage)
- Deployment target: Cloudflare Pages project `gardenandpool`

## Current Features
- RTL, mobile-first UI with header/nav, hero, services chips, panels (Diagnosis, Scheduler, Cabinet, Subscriptions, Smart Chat, Portal, Contact)
- Subscriptions unified: single chip "מנויים" showing 4 static plans (VIP, Full, Summer, Gardening), no prices/buttons
- Cabinet: per-user items with thresholds, alerts, and progress; backed by Supabase tables (RLS expected in production)
- Portal: profile/subscriptions/appointments/invoices (read-only demo paths), server endpoint for appointments, Israel same-day cancel rule
- Config endpoint: `/api/config/env` provides `baseUrl`, `supabase.url`, `supabase.anon`, and feature flags

## Auth Modal
- Two tabs: Login and Register
- Register tab includes Confirm Password validation
- "Show Password" toggle affects both password fields
- Header displays profile full name when available (fallback to email prefix)

## Environment & Secrets
- PUBLIC_BASE_URL: canonical app URL used for email confirmation and password reset redirects
  - Currently set to: `https://main.gardenandpool.pages.dev`
  - Managed in Cloudflare Pages secrets
- PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY: for Supabase client on frontend
- SUPABASE_SERVICE_KEY: only for server routes; NEVER exposed to client

## Deployment
- Build: `npm run build`
- Preview/Dev: `wrangler pages dev dist`
- Deploy branch preview: `wrangler pages deploy dist --branch <name>`
- Production (main): merge to `main` then `wrangler pages deploy dist --project-name gardenandpool` (or CI)

## Developer Workflow
1. Branch-based development (e.g., `cabinet-expansion`)
2. Build and deploy branch preview
3. Once approved, merge to `main`
4. Emails from Supabase will redirect back to `PUBLIC_BASE_URL` (main branch URL), ensuring users land on the best working version

## API Endpoints (selected)
- GET `/api/health` – health check
- GET `/api/config/env` – public config: `{ baseUrl, supabase: { url, anon }, features }`
- POST `/api/diagnose` – AI image diagnose (OpenAI if key exists, else mock)
- POST `/api/ai/chat` – smart chat (OpenAI if key exists, else mock)
- POST `/api/schedule/check` – appointment window conflict check (optional Supabase REST)
- GET `/api/portal/appointments` – list user appointments via Supabase Auth
- POST `/api/appointments/cancel` – cancel appointment with same-day block (Israel time)
- Stripe stubs for future billing

## Notes
- Static assets served via `serveStatic` from `public/`
- No Node.js APIs at runtime (Workers environment); use Web APIs
- Use RLS on Supabase tables in production
