# 03 — Components & Third-Party Libraries

## Web Components (the only reusable UI in the codebase)

Defined in `javascripts/functions.js:9-92`, registered via `customElements.define`. Both use `connectedCallback()` to inject a hardcoded template string via `innerHTML` — there is no attribute/slot API, no props.

### `<main-header>` — `functions.js:9-67`

Renders on every one of the 29 pages, always wrapped as:
```html
<header data-spy='affix'>
  <main-header></main-header>
</header>
```
Contents:
- Logo link to `index.html` (animated GIF `images/logo_casiopea_blanco.gif`)
- Primary nav (`<ul id='navigation'>`), hardcoded Spanish labels:
  - "Inicio" → `index.html`
  - "Quiénes somos" → `about-us.html`
  - "Proyectos" → `proyectos.html` (has a nested filter submenu, see docs/06)
  - "Contacto" → `contacto.html`
- Hamburger trigger (`.trigger`) for the responsive/mobile menu, toggled by jQuery in the IIFE later in the same file (`functions.js:179-187`)

**i18n implication**: This is where the language switcher (Phase 9) must be inserted, and where all nav/filter label strings must be swapped for `data-i18n` driven text once the loader exists.

### `<main-footer>` — `functions.js:71-89`

Renders on every page as:
```html
<footer>
  <main-footer></main-footer>
</footer>
```
Contents:
- 5 social icons (Vimeo, Behance, Facebook, Instagram, YouTube) — icon-only, decorative, not translatable text but should get `aria-label`s (see 09-accessibility-audit.md)
- Copyright line: `&copy; 2026 Casiopea. All Rights Reserved.` — note this line is **already in English**, an inconsistency with the rest of the Spanish-first site.

## Third-party / vendor JS (loaded on every page, in this order)

| File | Purpose | Confirmed used? |
|---|---|---|
| `jquery.min.js` | jQuery 1.x core | Yes, extensively |
| `jquery.easing.1.3.js` | Easing functions for jQuery animate | Presumed (not directly verified) |
| `jquery.mobile.custom.min.js` | Touch/mobile event support (`tap` events used throughout functions.js) | Yes |
| `tera-slider.js` | Custom slider plugin | **Loaded on all pages, no markup found using it** — likely dead weight |
| `tera-lightbox.js` | Custom lightbox plugin | **Loaded on all pages, no `.lightbox`-classed elements found in markup** — likely dead weight |
| `isotope.pkgd.min.js` | Masonry/filtering grid | Only meaningfully used on `proyectos.html` (`$grid.isotope(...)` in `functions.js:102-157`); loaded everywhere regardless |
| `bootstrap.min.js` | Bootstrap 3 JS (collapse, affix, etc.) | Yes — `header.affix()`, Bootstrap `collapse` used in about-us.html team bios |
| `validation.js` | Contact form validation | Only relevant on `contacto.html`, but loaded everywhere |
| `jquery.placeholder.js` | Placeholder polyfill for old browsers | Legacy, low value today |
| `waypoints.min.js` | Scroll-triggered reveal (`.fadeIn`, `.item` visibility) | Yes — `functions.js:154-168` |
| `functions.js` | Site-specific: Web Components, nav toggle, lazy-loading, filter logic | Yes, core file |
| `html5shiv.js` / `respond.min.js` | IE9 fallback, loaded via conditional comment | Legacy, effectively dead (IE9 usage ≈ 0 in 2026) |

`tera-slider.js` and `tera-lightbox.js` appear to be loaded defensively/by habit rather than by actual need — worth flagging in `11-technical-debt.md` but **not removing** as part of this i18n project (out of scope; removing could carry hidden risk).

## CSS libraries

- Bootstrap 3.x (`bootstrap.min.css`)
- Font Awesome 4.x (`font-awesome.min.css`) — icon font used in footer social links and elsewhere
- `tera-lightbox.css`, `tera-slider.css` — vendor styles for the plugins above, same "loaded but unclear if used" caveat

## External CDN dependencies

- Google Fonts: Roboto, Inconsolata (linked via `<link>` in every `<head>`)
- Lottie player: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js`, loaded on project pages that embed Lottie animations (via `<lottie-player>` custom element, itself a Web Component from the CDN package, not site code)

These are render-blocking network calls to third-party domains on every page load; relevant to performance audit but not something this i18n project should change.
