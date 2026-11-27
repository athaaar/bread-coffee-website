---
name: Warm Artisan Craft
colors:
  surface: '#fdf9f3'
  surface-dim: '#dddad4'
  surface-bright: '#fdf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ed'
  surface-container: '#f1ede7'
  surface-container-high: '#ebe8e2'
  surface-container-highest: '#e6e2dc'
  on-surface: '#1c1c18'
  on-surface-variant: '#504440'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f4f0ea'
  outline: '#827470'
  outline-variant: '#d4c3be'
  surface-tint: '#75584d'
  primary: '#26120a'
  on-primary: '#ffffff'
  primary-container: '#3d261d'
  on-primary-container: '#ad8b7f'
  inverse-primary: '#e4beb1'
  secondary: '#865301'
  on-secondary: '#ffffff'
  secondary-container: '#feb965'
  on-secondary-container: '#764800'
  tertiary: '#091b0f'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e3023'
  on-tertiary-container: '#849887'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#e4beb1'
  on-primary-fixed: '#2b160e'
  on-primary-fixed-variant: '#5b4136'
  secondary-fixed: '#ffddb9'
  secondary-fixed-dim: '#feb965'
  on-secondary-fixed: '#2b1700'
  on-secondary-fixed-variant: '#663e00'
  tertiary-fixed: '#d3e8d5'
  tertiary-fixed-dim: '#b7ccb9'
  on-tertiary-fixed: '#0e1f13'
  on-tertiary-fixed-variant: '#394b3d'
  background: '#fdf9f3'
  on-background: '#1c1c18'
  surface-variant: '#e6e2dc'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: 0em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 3rem
  margin-sm: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies the sensory warmth, architectural simplicity, and tactile precision of a modern specialty bakery and roastery. It merges refined editorial craftsmanship with warm, accessible minimalism—steering clear of rustic cliché in favor of considered, contemporary luxury.

### Target Audience & Emotional Intent
- **Audience:** Discerning coffee connoisseurs, artisan sourdough enthusiasts, and urban creatives seeking an elevated daily ritual.
- **Emotional Cadence:** Grounded, comforting, meticulously composed, and welcoming. Surfaces feel like stone counters dusted with flour; typography reads like an independent culinary monograph.

### Design Movement
- **Warm Minimalist & Editorial Tactile:** Generous negative space, intentional typographic contrast, low-contrast natural boundaries, and deliberate textural grounding.

## Colors

The palette derives strictly from raw culinary materials: slow-extracted espresso, Maillard-reaction golden crusts, organic herbal accents, and unbleached grain flours.

### Roles and Balance
- **Primary (`#3D261D` / Dark Roast `#2B1810`):** Anchors high-prominence interactions, primary calls to action, and core typographic structure.
- **Secondary (`#C88A3B` / Warm Crust `#E6A15C`):** Used for highlighting seasonal origins, state accents, micro-indicators, and subtle active underlines.
- **Tertiary (`#4A5D4E`):** A muted botanical green reserved for fresh botanical pairings, organic/sourcing verification, and restorative feedback tags.
- **Neutral Canvas (`#FAF6F0` / Steamed Milk `#F3EDE2`):** Primary canvas backgrounds and structural paneling, maintaining low optical fatigue. High-contrast typography relies on slate-tinged `#1C1917`.

## Typography

The pairing combines an editorial serif with a geometric yet human sans-serif to create an authentic balance between traditional culinary prestige and friction-free modern digital ordering.

### Typographic Hierarchy Rules
- **Headlines:** Use `Playfair Display` exclusively for brand narrative, item titles, and page headers. Keep line lengths under 28 characters for large sizes to preserve editorial cadence.
- **Body:** `Plus Jakarta Sans` handles all instructional copy, tasting notes, ingredient breakdowns, and process narratives.
- **Labels & UI Metadata:** Set prices, bag weights, batch roast timestamps, and nutritional stats in uppercase or medium-weight `Plus Jakarta Sans` with expanded letter-spacing for legibility at small sizes.

## Layout & Spacing

The layout is built upon an 8px base grid rhythm using a 12-column fluid grid system on desktop, collapsing to 8 columns on tablet and 4 columns on mobile.

### Spatial Relationships
- **Margins & Gutters:** Desktop experiences utilize generous `margin` (3rem) with `gutter` (1.5rem) to ensure screens breathe, mimicking broadsheet magazine layouts. Mobile compresses safely to `margin-sm` (1.25rem).
- **Component Breathing Room:** Group related culinary details using `space-xs` and `space-sm`. Keep macro sections divided by `space-xl` to prevent sensory clutter during menu exploration.

## Elevation & Depth

Visual hierarchy avoids artificial drop shadows. Instead, it relies on tonal layering, translucent glassmorphic surfaces, and hairline organic boundaries.

### Layering Principles
- **Base Layer:** Canvas sits at natural off-white (`#FAF6F0`).
- **Surface Elevation (Cards & Containers):** Elements sit on `#F3EDE2` or a crisp translucent surface (`rgba(255, 255, 255, 0.72)` with a `12px` backdrop blur).
- **Ambient Shadows:** Where elevation is mandatory (e.g., floating cart, active modal), apply an ambient, warm-tinted shadow: `0 8px 30px rgba(61, 38, 29, 0.06)`.
- **Ghost Borders:** Separate nested items and table tiers with low-contrast borders: `1px solid rgba(61, 38, 29, 0.08)`. Never use pure gray or black dividers.

## Shapes

The shape system pairs structured editorial containers with smooth interactive elements. Base cards, dialogue overlays, and product viewports adopt an 8px (`0.5rem`) radius to maintain clean geometry. Interactive targets such as chips, badges, and primary action buttons transition into full pill profiles (`9999px`) to invite touch and denote soft, tactile handling.

## Components

### Buttons
- **Primary:** Dark espresso background (`#3D261D`), pill-shaped (`rounded-full`), cream text (`#FAF6F0`). Smooth color transition to roasted slate (`#1C1917`) on hover with a micro-scale shift (`1.01x`).
- **Secondary / Outlined:** Transparent surface with `1.5px` border in `#3D261D` (or `rgba(61, 38, 29, 0.2)` default), smooth fill transition to `#F3EDE2` on hover.
- **Text / Inline Actions:** Understated serif or medium sans label with an animated underline accent in `#C88A3B`.

### Chips & Badges
- **Pill Badges:** Fully rounded (`rounded-full`), minimal horizontal padding (`space-md`), height bounded at 28px–32px.
- **Status/Origin Badges:** Single-origin, vegan, or seasonal flags use muted backgrounds: Rosemary tint (`rgba(74, 93, 78, 0.12)`) with tertiary text (`#4A5D4E`), or Crust Amber tint (`rgba(200, 138, 59, 0.14)`) with text (`#C88A3B`).

### Cards & Menu Tiles
- **Product Tiles:** Background set to `#F3EDE2` or frosted white. Image frame uses `overflow-hidden` with a `0.5rem` radius. Borders use subtle `1px solid rgba(61, 38, 29, 0.06)`.
- **Hover Behavior:** Product imagery undergoes an understated slow zoom (1.03x over 400ms ease-out). No heavy upward translation.

### Form Inputs & Selectors
- **Input Fields:** Crisp `#FAF6F0` fill with `1px solid rgba(61, 38, 29, 0.15)` border. Focus switches border color to `#C88A3B` with an ambient glow (`box-shadow: 0 0 0 3px rgba(200, 138, 59, 0.15)`).
- **Checkboxes & Radios:** Hand-finished precision. Radio toggles use inner concentric circles in `#3D261D`; checkboxes feature clean, unembellished check marks in warm white over an espresso fill when checked.

### Lists & Menus
- **Item Dividers:** Separated by `1px solid rgba(61, 38, 29, 0.07)`.
- **Arrangement:** Title and tasting notes left-aligned; price and weight right-aligned in monospace-leaning numeric weights to allow effortless scanning.