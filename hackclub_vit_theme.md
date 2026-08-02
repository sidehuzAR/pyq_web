# HackClub VIT Portal - Theme & Design System Documentation

An overview and complete design system reference for the **HackClub VIT Portal** theme.

---

## 🎨 Theme Overview

The HackClub VIT Portal features a **Cyber-Crimson Dark Mode** aesthetic. It blends deep dark tones (near-black and dark maroon) with rich crimson red gradients and glowing burnt-amber highlights, giving the interface a high-contrast, modern hacker/developer vibe.

---

## 🖤 Color Palette & Design Tokens

### Core Color System

| Token Name | Hex Code / Value | Usage & Visual Role |
| :--- | :--- | :--- |
| `--background` | `#020000` | Main application pitch-black background |
| `--surface` | `#120202` | Elevated surface / dark blood-maroon base |
| `--secondary` | `#370b09` | Dark mahogany secondary containers & table headers |
| `--primary` | `#720907` | Deep crimson primary actions & highlights |
| `--accent` | `#ac120c` | Vibrant fiery crimson for active states & highlights |
| `--highlight` | `#d07d22` | Warm amber / burnt orange accent & status color |
| `--text` | `#f4ede4` | Warm off-white / cream text for high contrast |
| `--text-muted` | `#bfa8a2` | Muted rose-grey for captions, labels & subtitles |
| `--border` | `#2a0d0d` | Subtle dark maroon border |

### Functional & Semantic Colors

| Semantic Token | Color / Hex | Description |
| :--- | :--- | :--- |
| `--success` | `#2e7d32` | Forest green status pills & positive feedback |
| `--warning` | `#d07d22` | Burnt amber warning indicators |
| `--danger` | `#ac120c` | Fiery red danger alert & action color |
| `--info` | `#720907` | Deep crimson info indicators |
| `--link` | `#d07d22` | Default hyper-link text color (Amber) |
| `--link-hover` | `#f4ede4` | Link hover state (Off-white) |

---

## 🔤 Typography

```css
--sans:    system-ui, "Segoe UI", Roboto, sans-serif;
--heading: "Inter", system-ui, sans-serif;
--mono:    ui-monospace, Consolas, monospace;
```

- **Base Styling**: `16px / 1.5 line-height`, `-webkit-font-smoothing: antialiased`
- **Text Color**: `#f4ede4` (Cream / Off-white)
- **Headings**: Styled in **Inter** with tight letter spacing and bold font weights (`700`-`900`).

---

## ✨ Gradients & Ambient Effects

### Background Glows & Shell Gradients
- **Admin & Dashboard Background**:
  - `radial-gradient(circle at top left, #ac120c47, transparent 30%)`
  - `radial-gradient(circle at bottom right, #d07d2240, transparent 24%)`
  - `linear-gradient(180deg, #1b0202 0%, #020000 100%)`
- **Hero Banner**:
  - `linear-gradient(135deg, rgba(172, 18, 12, 0.18), rgba(18, 2, 2, 0.95))`
- **Launch Screen & Branding Text**:
  - Vibrant text clipping gradient: `linear-gradient(135deg, #ff5a4f, #d3070e, #f25b24)`

---

## 🪟 Glassmorphism & Elevation

### Cards & Panels
- **Background**: `linear-gradient(145deg, rgba(25, 3, 3, 0.8), rgba(12, 1, 1, 0.95))`
- **Backdrop Filter**: `blur(16px)`
- **Border**: `1px solid rgba(255, 255, 255, 0.08)` (Top border highlighted at `rgba(255, 255, 255, 0.15)`)
- **Border Radius**: `28px` (Large rounded corners for cards)
- **Box Shadow**: `0 24px 60px rgba(0, 0, 0, 0.4)`

### Interactive Card Hover State
- **Transform**: `translateY(-6px)`
- **Border Color**: `rgba(208, 125, 34, 0.25)` (Amber glow)
- **Hover Shadow**: `0 32px 80px rgba(0, 0, 0, 0.5)`

---

## 🔘 Component Specifications

### Buttons
- **Shape**: Fully rounded pill shapes (`border-radius: 999px`).
- **Primary Button**:
  - Background: `var(--button-primary)` (`#720907`)
  - Hover: `var(--button-hover)` (`#ac120c`) + `translateY(-1px)`
  - Shadow: `0 18px 40px rgba(172, 18, 12, 0.3)`
- **Secondary Button**:
  - Background: `rgba(172, 18, 12, 0.08)`
  - Border: `1px solid rgba(172, 18, 12, 0.35)`

### Inputs & Forms
- **Input Background**: `#ffffff0a` (Translucent dark overlay)
- **Border**: `1px solid transparent` (Normal), `var(--highlight)` (`#d07d22`) on focus
- **Focus Ring**: `box-shadow: 0 0 0 3px rgba(208, 125, 34, 0.2)`
- **Border Radius**: `12px` to `14px`

### Scrollbars
- Custom fiery crimson scrollbar thumb (`#ac120c73`) over transparent track, turning amber (`#d07d2299`) on hover.

---

## 📐 Layout Architecture
- **Sidebar & Shell**: 280px sidebar layout collapsible to 80px or mobile drawer context.
- **Grid Systems**: 4-column responsive cards (`cards-grid`, `stats-grid`) transitioning down to single-column on mobile screens (`<=900px`).
