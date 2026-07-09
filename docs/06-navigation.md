# 06 — Navigation & Internal Linking

## Primary navigation (in `<main-header>`, `functions.js:9-67`)

| Label (ES) | Target | Notes |
|---|---|---|
| Inicio | `index.html` | |
| Quiénes somos | `about-us.html` | |
| Proyectos | `proyectos.html` | Has a nested filter submenu (below) |
| Contacto | `contacto.html` | |

Links use class `h-link`; a global click handler in `functions.js:190-214` intercepts clicks, fades the page out, then navigates — this is a page-transition effect that must keep working after i18n changes (it reads `href` directly, so it's link-agnostic and doesn't need modification for a language switcher, as long as the switcher's own click handler doesn't also carry the `h-link` class, or it will trigger an unwanted fade+navigate).

**Path quirk**: nav `href`s in the component are written relative to site root (`index.html`, not `/index.html` or `../index.html`). This works from root pages. Project pages (one level deeper) fix this at runtime via a per-page inline script that prepends `../` to every `a.h-link` (see `docs/04-pages.md`, project template section #1). Any new link added inside `<main-header>` for the language switcher must either (a) not use `h-link`/be an `<a>` with an href that needs root-relative resolution, or (b) be accounted for in that same path-rewriting script on project pages.

## Project category filter submenu

Nested under "Proyectos" in the header (`functions.js:32-57`), hidden by default (`style="display: none"`), revealed via a separate trigger button on `proyectos.html` itself (`#filter-trigger`). Categories:

| Label (ES) | `data-filter` value | CSS class used on tiles |
|---|---|---|
| All | `*` | (no class needed) |
| Motion graphics | `.motion-graphics` | `motion-graphics` |
| Stop motion | `.stop-motion` | `stop-motion` |
| Dibujo animado | `.animated-cartoons` | `animated-cartoons` |
| Video intervenido | `.video-i` | `video-i` |
| Fonima | `.fonima` | `fonima` |
| Talleres | `.workshops` | `workshops` (not observed on any current tile — category may be unused/legacy) |
| Visuales | `.visuals` | `visuals` (also not observed on any current tile) |

Filtering is powered by Isotope (`functions.js:101-129`) and driven by clicking either the filter-nav anchors (which re-trigger the `#filters` buttons) or filter buttons directly on `proyectos.html`. **Note**: several project tiles near the top of `proyectos.html` (lines 46-172) carry no category class at all — likely featured/uncategorized items that always show regardless of filter. This is existing behavior, not a bug to fix.

There's also a hash-based deep-link handler (`proyectos.html`, ~line 329+): on page load it reads `location.hash` (`#stop-motion`, `#motion-graphics`, etc.) and auto-triggers the matching filter button. This must keep working — the filter *labels* are translatable but the `data-filter` values/hashes/CSS classes are code and must stay identical across languages so a bookmarked `proyectos.html#stop-motion` link keeps working in either language.

## Project → project linking

Each project page has an "Otros Proyectos" section with an empty `<ul id="grid">`; `functions.js:227` inserts a single "Regresar" (back to `/proyectos.html`) link into it via `.other-projects-block`. This looks like a half-built related-projects feature — currently it only ever shows the one back-link, in Spanish ("Regresar"). This string needs a translation key like any other.

## Footer

No navigation, only 5 external social icon links (Vimeo, Behance, Facebook, Instagram, YouTube) — no translatable text besides the copyright line and (recommended, see accessibility audit) `aria-label`s to be added to the icon links.

## No URL-based language routing

There are no `/en/` or `/es/` path prefixes and no plans to add them (per the task's explicit requirement: "No URL changes... Remain on current page"). Language state will live entirely in `localStorage` plus a runtime DOM swap — this document is the baseline confirming there's no existing routing logic to conflict with that approach.
