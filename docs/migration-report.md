# Migration Report — Spanish/English i18n

Summary of the full i18n project: what was analyzed, what changed, why, and what's left. For architecture rationale see `docs/12-architecture-design.md`; for the fast-reference version see `agent-context.md` in the project root.

## Files analyzed (Phase 1)

Full site: 6 root HTML pages, 22 project HTML pages, `javascripts/functions.js` (the site's only reusable components), all CSS, the PHP contact form handler, and the existing `README.md`/`OPTIMIZATION-GUIDE.md`/`.agent.md`. Detailed findings in `docs/01` through `docs/11`.

## Files created

| File | Purpose |
|---|---|
| `locales/es.json`, `locales/en.json` | Interface strings (nav, footer, forms, about, contact, 404, root-page SEO) |
| `content/projects.json` | Per-project technique value (the one genuinely translatable per-project field) |
| `javascripts/i18n.js` | The i18n runtime: locale fetch/cache, DOM binding, FOUC prevention, switcher logic, public `window.CasiopeaI18n` API |
| `docs/01` – `docs/12`, `docs/content-inventory.md`, `docs/seo-content.md`, `docs/i18n-guide.md`, `docs/content-guide.md`, `docs/migration-report.md` | Audit, architecture, and usage documentation |
| `agent-context.md` | Condensed onboarding doc for future agents/contributors |

## Files modified

| File | What changed |
|---|---|
| `javascripts/functions.js` | `Header`/`Footer` Web Component templates gained `data-i18n`/`data-i18n-aria-label` bindings, the ES\|EN language switcher, and an `aria-live` announcer region; footer copyright and the JS-injected "Regresar" link now translate |
| `javascripts/validation.js` | Sending/Thank you!/Error!/validation-error strings now sourced from the active locale via `window.CasiopeaI18n`; also fixed a pre-existing bug (validation errors referenced a `.msg` element that didn't exist in the DOM) |
| `stylesheets/the-casiopea-styles.css` | Added switcher styling and the `.i18n-pending` FOUC-prevention rule |
| All 6 root HTML pages | `<html data-seo-key>` + `lang`, FOUC head script, fixed the broken `<meta name="description">` tag (was `name=''`, did nothing on any page), `i18n.js` loaded, page-specific content wrapped in `data-i18n`/`data-i18n-en`/`data-i18n-en-html` |
| All 22 project HTML pages | Same head/script wiring, `data-project-slug`, every credit `<dt>` label wrapped with `data-i18n-en`, Cliente/Año/Técnica/"Otros Proyectos" wrapped with shared `data-i18n` keys, technique value wired to `content/projects.json` |

## Architecture decisions

The single biggest decision was **narrowing Phase 5 of the original brief**: rather than moving all project data (credits, media, metadata) into `content/projects.json` and rendering pages from it, the actual content was inventoried first (`docs/content-inventory.md`) and found to be almost entirely proper nouns (people's names, client names, project titles) that shouldn't be translated at all. Only ~55 shared/near-shared credit labels and one per-project technique value needed real translation. Building a generic JSON-driven renderer for that would have meant touching and restructuring all 22 hand-built project pages — high risk, against the brief's own "never rewrite unnecessarily" rule, for translation coverage that a much smaller, lower-risk change achieves just as completely. Full reasoning in `docs/12-architecture-design.md`; this was proposed to and approved by the project owner before implementation began.

Two smaller scope reductions followed the same logic, both approved before implementation: `content/faq.json` + a loader was dropped in favor of inline `data-i18n-en`/`data-i18n-en-html` directly in `faq.html` (FAQ is static and unlikely to grow, one less moving part); `content/navigation.json`/`content/footer.json` were folded into `locales/*.json` since they're pure interface text, not structured data.

Two pre-existing English-only inconsistencies (the footer copyright, `404.html`'s heading text) were given proper Spanish defaults with English translations, per an explicit decision, rather than left as-is or silently "fixed" without discussion.

## Translation statistics

- **54 shared locale keys**, identical structure in `locales/es.json` and `locales/en.json` (verified by automated parity check)
- **55 distinct project credit labels** translated via inline `data-i18n-en` across 22 project pages
- **13 FAQ answers** translated (4 containing inline links, handled via `data-i18n-en-html` to preserve markup)
- **21 project technique values** translated in `content/projects.json` (1 project, `video-explicativo`, has its entire metadata block inside a pre-existing HTML comment — not rendered either language, left untouched)
- **1 embedded-link paragraph** (about-us studio description) translated via `data-i18n-en-html`, links verified intact post-translation
- **6 pages** now have real SEO title/description pairs in both languages; 22 project pages have the `data-seo-key` lookup wired but no copy written yet (documented gap, see below)

## SEO improvements

- Fixed a sitewide bug: every page's `<meta name="description">` was `<meta content='Description' name=''>` — the empty `name` attribute meant the tag did nothing, on any page, in the original site. Now real, working, per-language descriptions on all 6 root pages.
- Added `<html lang="es">`, dynamically synced to `lang="en"` on language switch — previously **no page on the site** declared a language at all.
- `<title>` and `<meta name="description">` now swap per language on the 6 root pages via the `data-seo-key`/`seo.*` lookup mechanism.

Not done (intentionally, see "Remaining" below): Open Graph tags, Twitter Cards, JSON-LD structured data, `hreflang`, `sitemap.xml`, `robots.txt`. These were scoped as general SEO hygiene beyond the i18n task in `docs/08-seo-audit.md` and `docs/seo-content.md`, not required for bilingual support to work correctly, and not requested.

## Accessibility improvements

- `<html lang>` now present and dynamically correct — screen readers will use the right pronunciation rules for whichever language is displayed (previously true for neither language, on any page).
- The language switcher is built from real `<button>` elements with `aria-pressed` state and a group `aria-label`, fully keyboard-reachable in the natural tab order (verified: Home → About → Projects → Contact → ES → EN, right after the primary nav).
- Added an `aria-live="polite"` announcer (`#i18n-announcer`) so screen reader users get non-visual feedback when the language changes, since it happens without a page navigation event they'd otherwise notice.
- Footer social icon links gained `aria-label`s (Vimeo, Behance, Facebook, Instagram, YouTube) — previously bare icon-font links with no accessible name.
- Fixed the `validation.js` bug where form errors referenced a `.msg` element that didn't exist in the DOM (added it to `contacto.html`), so validation failures are now actually visible/announced to users, in the correct language.

Pre-existing accessibility gaps intentionally **not** touched (per "no unrequested scope" guidance): placeholder-only form labels (no real `<label>` elements), `user-scalable=no` disabling pinch-zoom, inconsistent `alt` text coverage on content images. All documented in `docs/09-accessibility-audit.md` for a future pass if wanted.

## Performance considerations

- `i18n.js` is a small, dependency-free vanilla JS file (no i18next or similar library), consistent with the rest of the codebase's approach.
- On the default Spanish path, the FOUC-prevention mechanism does nothing extra — no elements are hidden, no additional wait, since the HTML is already correct. Only the English path pays the cost of a locale fetch + hide-until-ready.
- Lazy-loading, WebP `<picture>` fallbacks, Isotope filtering, and all existing performance work were left completely untouched — verified via full-page screenshot comparison and a 56-page-load automated sweep with zero console errors introduced.
- `content/projects.json` (technique values only) is a small, single fetch per project page — not a heavy content-loader pulling gallery/media data, which was the more expensive approach considered and rejected (see architecture decisions above).

## QA performed

- Manual + Playwright-driven browser verification at each rollout stage (infrastructure → root pages → project pages), not just a single pass at the end.
- Automated locale-key parity check: 54/54 keys identical in structure between `es.json` and `en.json`.
- Automated `data-i18n` reference check: every key referenced in any of the 29 HTML files resolves to a real entry in `locales/es.json`.
- Full sweep: all 29 pages loaded in both languages (56 page-loads), console-error-free except one confirmed-benign third-party CDN log line from the Lottie player library on `smmx.html` (present regardless of language, unrelated to any change made here).
- Visual screenshot comparison (ES vs EN) on the home page and on the most structurally complex project page (Poliangular, 19 credit rows) — layout identical, only text differs, all embedded links survived translation.
- Keyboard-navigation check on the language switcher: focusable, activates via Enter, `aria-pressed` and the live-region announcement both fire correctly.

## Remaining technical debt (not introduced by this project)

Carried over from `docs/11-technical-debt.md`, unchanged by this work: `functions.jss` and `stylesheets/old-styles.css`/`.less` are dead/unreferenced files; the `style.css`/`style.min.css` split between root and project pages looks unintentional; `tera-slider.js`/`tera-lightbox.js` are loaded everywhere with no confirmed markup usage; the "Otros Proyectos" related-projects feature only ever shows one static back-link; the about-us team bios section remains commented out per explicit decision.

## Future recommendations

- **Per-project SEO copy**: `data-seo-key="project.<slug>"` and the lookup mechanism exist on all 22 project pages, but no `seo.project.*` entries were written into the locale files (22 short bilingual title/description pairs — mechanical work, deliberately deferred as optional, see `docs/seo-content.md`).
- **Open Graph / Twitter Card / JSON-LD / sitemap.xml / robots.txt**: general SEO hygiene beyond bilingual support, scoped out of this project, would meaningfully improve social-share previews and search indexing if wanted later.
- **Pre-existing accessibility gaps** (placeholder-only labels, disabled pinch-zoom): worth a dedicated pass if the studio wants to go further than "no regressions."
- If the about-us team bios section is ever re-enabled, it needs the same i18n treatment as everything else — see `docs/content-guide.md`'s note on `team.json`.
