# Agent Context — CASIOPEA Website (i18n project)

This file is the fast-onboarding doc for any agent (or human) picking up work on this repo after the Spanish→English i18n project. It supersedes `.agent.md` for anything related to internationalization; `.agent.md` still holds the general pre-i18n project orientation (stack, folder purpose, "how to add a new project" recipe) and remains accurate for non-i18n work.

For the full paper trail — audit findings, architecture rationale, content inventory — see `docs/`. This file is the condensed, current-state summary; `docs/` is the historical record of how we got here.

## What this project is

CASIOPEA is a static portfolio site for a Mexico City animation studio. No framework, no build step, no bundler — hand-authored HTML, jQuery, Bootstrap 3, two Web Components (`<main-header>`/`<main-footer>`), and vanilla JS for everything else. See `.agent.md` and `docs/01-project-overview.md` for the pre-i18n baseline.

**Spanish is the default and source-of-truth language.** English is a second language added without changing the site's markup, visuals, animations, or URLs. There is no `/en/` path — the same URL serves both languages, switched client-side.

## i18n architecture (implemented, not just designed)

Full rationale is in `docs/12-architecture-design.md`; this section is what's actually true in the codebase today.

```
locales/es.json       interface strings (nav, footer, forms, about, contact, 404, SEO titles/descriptions)
locales/en.json       same key structure, English values
content/projects.json per-project "technique" value only — { "<slug>": { "technique": { "es": "...", "en": "..." } } }
javascripts/i18n.js   the whole i18n runtime — locale fetch/cache, DOM binding, FOUC prevention, switcher wiring
```

**No `content/faq.json`, no `content/navigation.json`, no generic content-loader.** Those were in the original brief's Phase 5 sketch but were deliberately dropped after the actual content was inventoried — see `docs/12-architecture-design.md` §1 and `docs/content-inventory.md` for why. FAQ and project credit labels use inline `data-i18n-en`/`data-i18n-en-html` attributes directly in the HTML instead (see below). If you're tempted to "finish" the JSON-driven version of Phase 5, don't — it was a considered rejection, not an oversight.

### The three binding mechanisms, and when to use which

1. **`data-i18n="some.key"`** — for text that's identical/reused across many pages (nav labels, footer, form labels, Cliente/Año/Técnica headings, "Otros Proyectos"). Looked up in `locales/{es,en}.json`. The hardcoded Spanish text already in the HTML is the fallback/default; `i18n.js` overwrites it after fetching the locale JSON — including on the Spanish path, so the JSON is the real source of truth even for the default language.
   - Attribute variants: `data-i18n-placeholder`, `data-i18n-alt`, `data-i18n-title`, `data-i18n-aria-label`, `data-i18n-value` — same lookup, sets the named attribute instead of `textContent`.

2. **`data-i18n-en="English text"`** (optionally paired with `data-i18n-es="..."`) — for one-off strings that don't warrant a shared locale key: project credit labels (55 distinct role labels across 22 pages, see `docs/content-inventory.md` §B), FAQ answers, the injected "Regresar"/"Back" link. No JSON involved; the translation lives right next to the Spanish text in the same HTML file. Sets `textContent` only.

3. **`data-i18n-en-html="…"`** (optionally paired with `data-i18n-es-html`) — same idea as #2, but for text runs containing inline markup (e.g. the about-us paragraph's embedded Instagram links) that a `textContent` swap would destroy. Sets `innerHTML`. The attribute value must have `"` escaped as `&quot;` since it's itself inside an HTML attribute. Used sparingly — only where a real `<a>`/`<br/>` needs to survive translation.

### Per-project technique value

Project pages that show a Técnica/Technique value get `<p data-technique-value>...</p>` and the page's `<body>` gets `data-project-slug="the-slug"`. `i18n.js` fetches `content/projects.json`, looks up `data[slug].technique[lang]`, and fills the element. This is the **only** thing sourced from `content/projects.json` — everything else per-project (names, client, media) is untranslated and stays exactly where it always was in the HTML.

### FOUC prevention

Every page's `<head>`, before any stylesheet, has:
```html
<script>
    (function () {
        var lang = localStorage.getItem('casiopea-lang') || 'es';
        document.documentElement.setAttribute('lang', lang);
        if (lang !== 'es') document.documentElement.classList.add('i18n-pending');
    })();
</script>
```
paired with `html.i18n-pending body { visibility: hidden; }` in `the-casiopea-styles.css`. Spanish is already what's painted in the HTML, so the Spanish path never hides anything. Only the English path hides the page until `i18n.js` (loaded normally at the bottom, like every other script) finishes applying translations on `DOMContentLoaded`, then removes the class. If the fetch fails, the class is removed anyway and the Spanish text shows — "never leave the page blank/untranslated" is satisfied by construction, not a special case.

### `<html data-seo-key="...">`

Root pages use short keys (`home`, `about`, `projects`, `contact`, `faq`, `errors404`). Project pages use `project.<slug>` (declared but not yet populated in `locales/*.json` — per-project SEO copy was scoped as a nice-to-have in `docs/seo-content.md` and not written for all 22 projects; only the 6 root pages have real `seo.*` entries today). `i18n.js` looks up `seo.<key>.title`/`.description` and applies them to `<title>`/`<meta name="description">` if found; silently does nothing if the key doesn't exist yet, which is why project pages don't error even though their `seo.project.*` keys aren't in the locale files.

### Public JS API

`i18n.js` exposes `window.CasiopeaI18n = { t(key, fallback), getLang() }` for other scripts that need a translated string outside the declarative bindings — currently used by `javascripts/validation.js` for the Sending/Thank you!/Error!/validation-error button and message text.

### Language switcher

Lives inside `<main-header>`'s template in `javascripts/functions.js` (search for `lang-switch`). Two real `<button>` elements (`aria-pressed`, `data-lang="es"|"en"`), deliberately **not** given the `h-link` class so they're excluded from the page-fade-and-navigate handler and the project-page `../`-prefix rewrite that only target `a.h-link` elements. Clicking calls `applyLang(lang, { persist: true })` in `i18n.js`, which re-applies every binding above without a page reload or URL change.

## Files touched by this project

- **New**: `locales/es.json`, `locales/en.json`, `content/projects.json`, `javascripts/i18n.js`, `docs/*` (14 files), `agent-context.md` (this file)
- **Modified**: `javascripts/functions.js` (Header/Footer templates + switcher), `javascripts/validation.js` (translated feedback strings, fixed the pre-existing missing-`.msg`-element bug), `stylesheets/the-casiopea-styles.css` (switcher styles + FOUC rule), all 6 root HTML pages, all 22 project HTML pages
- **Untouched by design**: gallery/media markup on every project page, Isotope filtering logic, the hash-based deep-link filter handler, lazy-loading system, Bootstrap/jQuery/vendor files, all image/video assets, all folder structure

## Conventions to follow when extending this

- **New translatable interface string used on 2+ pages** → add to both `locales/es.json` and `locales/en.json` under a sensible namespace, bind with `data-i18n`.
- **New translatable string used once, on one page, no markup inside it** → `data-i18n-en="..."` inline, no JSON.
- **Same, but contains a link/inline tag** → `data-i18n-en-html="..."` with `"` escaped as `&quot;`.
- **New project page** → follow the existing 22 as a template (see `.agent.md`'s "Cómo Agregar Nuevos Proyectos" section for the non-i18n parts), then: add `data-project-slug="new-slug"` to `<body>`, wrap each `<dt>` credit label with `data-i18n-en`, wrap the Cliente/Año/Técnica `<h4>`s with the existing `data-i18n="projects.client|year|techniqueLabel"` keys, add `data-technique-value` to the technique `<p>`, add an entry to `content/projects.json`, load `../javascripts/i18n.js` after `../javascripts/functions.js`, add the FOUC head script, fix the meta description tag, set `data-seo-key="project.<slug>"` (optionally add real `seo.project.<slug>` copy to both locale files — not required, just currently sparse).
- **Do not** introduce a generic content-loader / re-templating for project galleries. That was considered and rejected — see `docs/12-architecture-design.md` §1 and this file's i18n architecture section above.
- **Never hardcode English-only strings** without a Spanish default in the same place — the site's default-language guarantee depends on every element's baked-in text being correct Spanish.

## Known pre-existing gaps (not introduced by this project, not fixed unless explicitly asked)

- `about-us.html`'s team bios section is commented out (dead markup, real content) — left as-is per explicit decision.
- Some project pages (`campanias.html`, `video-explicativo.html`, part of `hise.html`) have their entire Cliente/Año/Técnica block wrapped in a pre-existing HTML comment — not rendered, not something this project fixed or should fix.
- Placeholder-only form labels (no real `<label>` elements) and `user-scalable=no` on the viewport meta tag are pre-existing accessibility issues — see `docs/09-accessibility-audit.md`.
- `functions.jss`, `stylesheets/old-styles.css/.less` are dead/unreferenced files — see `docs/11-technical-debt.md`.
- Per-project SEO copy (`seo.project.<slug>.title/description`) is not filled in for any of the 22 projects yet — infrastructure supports it, content doesn't exist.
