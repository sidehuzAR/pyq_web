# PYARCHIVE (papersvitc) — Implementation Overview

## What this is
A previous-year-question-paper (PYQ) archive for VIT engineering students. Students search/filter/browse papers by course, exam type, slot, year, semester. Upload new scans. Admins moderate a queue before anything goes public.

## Stack
- React + Vite
- Tailwind CSS (Bauhaus tokens defined in theme config, not inline hex)
- JSZip for client-side batch downloads
- LocalStorage as the persistence layer for this build (see `01-data-schema.md` for keys). If a backend gets added later, the schema stays the same — only the storage layer swaps.
- lucide-react for icons

## File map for this spec
1. `00-overview.md` — this file
2. `01-data-schema.md` — entities, enums, storage keys
3. `02-functional-spec.md` — every feature, filter, action, and business rule
4. `03-design-system-bauhaus.md` — full visual system (tokens, components, layout, motion, a11y)
5. `04-component-architecture.md` — routes, component tree, folder structure
6. `05-build-plan.md` — build order for the agent to follow

## How to use this with Antigravity
Feed all six files as context in one shot. Build order is `05-build-plan.md` — follow it phase by phase instead of trying to generate the whole app in one pass. Data schema and functional spec are the source of truth for logic. Design system file is the source of truth for everything visual — don't let the model invent its own UI patterns.

## Non-negotiables
- Public pages only ever show `status == 'approved'` papers. Pending/rejected must never leak into public search, autocomplete, or subject pages.
- Admin auth and moderation mutations are isolated from the public bundle — no admin logic, routes, or credentials should be inspectable from the public site's DevTools/network tab in a real deployment. For this build (localStorage, no backend), simulate this separation in code structure (separate module, gated route) even though a determined user could still find it client-side — note this as a known limitation, not something to paper over.
- Rate limiting (5 uploads/hour/user) is enforced client-side against the `pyarchive_upload_count_v1` key for this build. Same caveat: real anti-abuse needs server enforcement eventually.
