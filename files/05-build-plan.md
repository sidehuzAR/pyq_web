# Build Plan

Follow phases in order. Each phase should be a working, viewable state before moving to the next — don't generate the whole app in one shot.

## Phase 0 — Scaffold
- Vite + React project, Tailwind installed and configured with the `bauhaus` color tokens from `03-design-system-bauhaus.md`.
- Router set up with the routes in `04-component-architecture.md`.
- `lib/storage.js` with read/write helpers for all four localStorage keys, seeded with a handful of fake courses + approved papers for dev purposes.
- `constants/enums.js` populated from `01-data-schema.md`.

## Phase 1 — Public catalogue (core value first)
- Home page: hero (search + geometric composition), recent papers row, browse-by-subject row.
- Main catalogue page: paper cards, filter bar, sort control, search/autocomplete.
- Subject detail page with smart-scoped filters.
- No upload, no viewer, no admin yet — just get browsing/finding solid, since that's priority #1 in the design doc.

## Phase 2 — Viewer + batch download
- Paper viewer page/modal: canvas, zoom toolbar, metadata bar, share link, report modal.
- Batch selection checkboxes on cards + Select All/Deselect All/Download ZIP via JSZip.

## Phase 3 — Upload flow
- Upload form with all fields, dropzone, client-side validation (file type/size).
- Rate limiting against `pyarchive_upload_count_v1`.
- Writes to pending, never approved.

## Phase 4 — Admin portal
- Password gate.
- Moderation queue tab: list, inspector modal, accept/reject actions, pending count badge.
- Course registry tab: add subject form, registry viewer.
- Verify: accepting a paper moves it from pending key to approved key, and auto-registers new course codes.

## Phase 5 — Polish pass
- Toast notification stack wired into every action that needs one (listed in `02-functional-spec.md` §8).
- Motion pass: hover/active states per the design doc's restrained motion rules.
- Responsive pass: mobile nav, touch target sizes, hero type scaling.
- Accessibility pass: focus rings, contrast check on every color pairing actually used, keyboard nav through filters/search/viewer/upload.

## What to explicitly avoid at every phase
- No UI decisions from `features_info.md` — that file only ever governs data/logic, never look.
- No Neo-brutalist patterns leaking in (borders on everything, hard shadows on every card, rotation, halftones) — the anti-patterns list in the design doc is a hard boundary, not a suggestion.
- No admin logic imported into public-facing components (Phase 4 onward).
