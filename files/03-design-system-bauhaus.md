# Design Style: Bauhaus

This is the only source of truth for visual decisions. Ignore any UI hints in the functional spec — logic and structure only come from there.

## Design philosophy
Modern digital Bauhaus, not a literal 1920s poster reproduction. Geometric, rational, functional, editorial, structured, visually distinctive. For a student-built PYQ site, usability outranks aesthetics — the interface must make it instantly obvious where the user is, what they can search/filter, and how to get a paper.

## Core principles
1. **Form follows function** — every shape communicates hierarchy (rectangles = content areas, lines = section breaks, circles = status/category, color blocks = information type). No decoration that doesn't earn its place.
2. **Geometric construction** — rectangles, squares, circles, triangles, straight/diagonal lines only. No blobs, gradients, glassmorphism, soft floating cards.
3. **Grid as foundation** — visible columns, consistent spacing units, strong horizontal divisions. Asymmetry allowed (60/40 splits, offset heroes) but always controlled, never at the cost of usability.
4. **Functional minimalism** — strong typography, large color fields, disciplined spacing over shadows/gradients/glow/excessive rounding.
5. **Primary color as structure** — red/blue/yellow/black/off-white. Color divides the page, doesn't just decorate it. One dominant accent per section, not all colors everywhere.
6. **Typography as architecture** — geometric sans-serif, large confident headlines, readable body text, same hierarchy job as shapes.
7. **Controlled asymmetry** — intentional imbalance (offset cards, vertical color strips, oversized numbers) without ever confusing the user about where to look first.
8. **Visual rhythm** — alternating backgrounds, rules, section numbers, repeated rectangles let a user scan structure before reading text.
9. **Honest digital materials** — flat color, paper-like off-white, precise lines. No fake paper grain/texture.

## What it is NOT
Not a generic SaaS dashboard, not Swiss-design-clone, not monochrome corporate, not a literal poster, not Art Deco, not Neo-brutalist, not a kids' site. Avoid: hard shadows everywhere, sticker rotations, thick borders on every element, comic type, halftones, noise, badge spam, exaggerated hovers.

---

## Tokens

### Colors
| Name | Hex | Use |
|---|---|---|
| Canvas | `#F4F0E6` | page background, default — never pure white as default bg |
| Ink | `#111111` | text, icons, dividers, borders (pure `#000` only for strong compositions) |
| Bauhaus Red | `#D92D20` | primary actions, selected states, key nav |
| Bauhaus Blue | `#155A8A` | category sections, links, secondary blocks |
| Bauhaus Yellow | `#F2C230` | CTAs, selected filters, highlights |
| White | `#FFFFFF` | inside panels for contrast, alternate with off-white intentionally |

Rules: ink is the structural base; red/blue/yellow are accents, one dominant per composition; strong contrast always; no gradients, no pastels, no muddy mixing; large flat blocks over small decorative splashes.

### Typography
Font: `Inter` primary, `DM Sans` alt, `Montserrat` for a more geometric historical feel — pick based on what the project already loads.

Weights: 800/900 hero, 700 headings/nav/buttons, 500/600 labels/metadata, 400 body. Body text is allowed to just be readable — don't force everything bold.

Scale: Display 64–112px, H1 48–72px, H2 36–52px, H3 24–36px, Body Large 20–24px, Body 16–18px, Metadata 13–15px.

Headings uppercase/title-case per context, tight tracking. Academic content (subject names, question text) stays natural, not uppercase-forced.

### Radius & borders
Default radius `0px`. Small radius only if a component library forces it. `rounded-full` reserved for genuinely circular elements (status dots, decoration). No pill buttons, no rounded SaaS cards.

Borders: 1px structural separators, 2px important component boundaries, 3–4px major graphic compositions. Not every card needs a border.

### Shadows
Minimal. If depth is needed: `box-shadow: 4px 4px 0 #111111`, used sparingly. Depth mostly comes from overlapping planes/color blocks, not shadow.

### Backgrounds
Flat by default. Optional subtle grid (hero/empty states only, not the whole site):
```css
background-image:
  linear-gradient(to right, rgba(17,17,17,0.06) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(17,17,17,0.06) 1px, transparent 1px);
background-size: 40px 40px;
```

---

## Components

**Buttons** — rectangular, flat, sharp corners. Primary = red bg. Secondary = yellow bg, dark text. Tertiary = blue bg, white text. Outline = off-white bg + 2px dark border. Label style: bold, concise, often uppercase (`DOWNLOAD PAPER`, `SEARCH PAPERS`). Hover = color/border change, small translate. No bounce.

**Cards** — off-white/white bg, 1–2px dark border, sharp corners, generous padding. Colored header strips allowed (red = important, blue = subject category, yellow = new) but don't rainbow every card.

**Paper cards** (primary component) — must expose subject, semester, year, exam type, academic year, paper/solution availability, and the view/download action at a glance. Year should read as visually prominent since students browse chronologically.

**Inputs** — large rectangular field, 2px dark border, off-white/white bg, strong type. Focus state: yellow accent bg or stronger border. No glow rings, no rounded pills.

**Filters** — rectangular controls in a clear grid. Selected = yellow/red bg + dark text. Unselected = off-white bg + dark border.

**Navigation** — strong horizontal alignment, geometric logo mark (square/circle/triangle combo), concise items, active page gets a colored block behind it. No floating glass nav.

**Badges** — sparse use (`NEW`, `SOLUTIONS`, `VERIFIED`). Rectangular or circular, one accent color each, no rotation/sticker treatment.

**Icons** — lucide-react, 2–3px stroke, geometric, support text rather than replace it.

---

## Layout

Container: `max-w-7xl` site-wide, `max-w-6xl` for paper listings/search/subject pages.

Grid: hero 60/40 split. Paper listing 3 cols desktop / 2 tablet / 1 mobile. Filters 4 cols desktop / 2 tablet / 1 mobile.

Spacing: 8px base unit — 8/16/24/32/48/64/96.

Asymmetry belongs in hero/landing/intro sections. Functional pages (search results, listings) should be systematic and boringly scannable — personality lives on the homepage, not in the way students find a paper before an exam.

### Homepage shape
Hero: large statement + search on one side, geometric composition (circle/square/triangle) on the other, search is still the dominant action. Below: recent papers row, browse-by-subject row.

### Subject page shape
Large course title, year numbers as big visual anchors, exam type shown as colored blocks under each year.

### Search results
Consistent alignment, no heavy animation, stable predictable cards — speed and scanability over cleverness.

---

## Motion
Fast and precise, not playful. `duration-150`/`duration-200`, `ease-out`. Buttons: color/border change + 1–2px translate on hover, 1–2px down on active. Cards: subtle bg/accent shift + 1–2px lift on hover, nothing dramatic. Nav active states change instantly, no animated underline sweep. Decorative geometry can have very subtle slow motion (rotation, drift) — never the site's main visual identity. Respect `prefers-reduced-motion`.

---

## Responsive
Mobile-first. Breakpoints: sm 640 / md 768 / lg 1024 / xl 1280.
Hero type scales `text-5xl sm:text-6xl md:text-8xl` — don't let display type wreck mobile usability.
Desktop asymmetric layouts collapse to a clean vertical stack on mobile: title → description → search → geometric element → recent papers.
Mobile nav: rectangular menu button, stacked list, no complex animation.
Touch targets: minimum ~44x44px, prefer `h-12`+ for primary controls.

## Accessibility
WCAG AA contrast on every text/background pairing used (dark-on-offwhite, dark-on-yellow, white-on-red, white-on-blue, white-on-dark). Visible focus ring always:
```css
focus-visible:outline-none;
focus-visible:ring-2;
focus-visible:ring-black;
focus-visible:ring-offset-2;
```
Full keyboard nav for search, filters, paper actions. Semantic HTML (`header`, `nav`, `main`, `section`, `article`, `button`, `form`) with ARIA labels on icon-only controls.

## Non-genericness checklist
- Oversized typography as an architectural element (e.g. a giant `2025` next to a listing)
- Composed (not scattered) geometric hero: circle + square + triangle + lines + color plane
- Color planes covering 20–40% of a section, not thin accent strips everywhere
- Editorial alignment — nothing floats unaligned to the grid
- Strong section dividers via rules + background color shifts
- Number-based section labels (`01 SUBJECTS`, `02 RECENT PAPERS`, `03 CONTRIBUTE`) — fits the academic framing well
- Controlled shape overlap into section boundaries, never into functional content
- Repetition of motifs (same divider weight, same circle size, same accent logic) site-wide

## Implementation rule
Centralize tokens in the Tailwind theme config, not scattered hex values:
```js
colors: {
  bauhaus: {
    canvas: "#F4F0E6",
    ink: "#111111",
    red: "#D92D20",
    blue: "#155A8A",
    yellow: "#F2C230",
    white: "#FFFFFF"
  }
}
```
Use `bg-bauhaus-red`, never `bg-[#D92D20]` inline.

## Priority order (don't invert this)
1. Find a paper fast
2. Understand what the paper is
3. Access/download it
4. Browse by subject/semester/year/exam type
5. Discover other useful content
6. Visual identity

Bauhaus serves the archive. The archive is not a poster with a search bar bolted on.
