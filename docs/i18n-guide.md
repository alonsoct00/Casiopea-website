# i18n Guide

How the Spanish/English translation system works, and how to extend it. For the *why* behind these decisions, see `docs/12-architecture-design.md`. For a fast condensed summary meant for AI agents picking up this repo, see `agent-context.md` in the project root — this document is the longer, human-oriented version.

## How translations work

Spanish is the default language and is always what's hardcoded directly in the HTML — every page renders correctly with zero JavaScript, in Spanish. English is applied on top, at runtime, by `javascripts/i18n.js`, without a page reload and without changing the URL.

There are three ways text gets translated, depending on how the string is used:

### 1. Shared keys — `locales/es.json` / `locales/en.json`

Use this for text that repeats across many pages: navigation, footer, form labels, the Cliente/Año/Técnica headings on project pages, and similar. Example, from the header:

```html
<a class="h-link" href="index.html" data-i18n="nav.home">Inicio</a>
```

`i18n.js` looks up `nav.home` in whichever locale file is active and sets the element's `textContent`. The Spanish text already sitting between the tags is what you see before JavaScript runs, and is also re-applied from `locales/es.json` once it loads — so the JSON file, not the HTML, is the actual source of truth even for Spanish.

Attribute translations work the same way with different data attributes:

| Attribute | Sets |
|---|---|
| `data-i18n` | `textContent` |
| `data-i18n-placeholder` | `placeholder` |
| `data-i18n-alt` | `alt` |
| `data-i18n-title` | `title` |
| `data-i18n-aria-label` | `aria-label` |
| `data-i18n-value` | `value` |

All of these take a dotted key path (`contact.form.name`, `about.heroAlt`, etc.) that must exist in **both** `locales/es.json` and `locales/en.json` with the same structure.

### 2. Inline pairs — `data-i18n-en` / `data-i18n-es`

Use this for a string that appears once, on one page, and doesn't need a shared key — the 55 different project credit labels ("Dirección:", "Producción:", "Puppet:", etc.) and the FAQ answers are the main examples:

```html
<dt data-i18n-en="Direction:">Dirección:</dt>
```

No JSON file involved. When the active language is English, `i18n.js` sets `textContent` to the `data-i18n-en` value; the Spanish text already in the HTML is the default. If you ever need an explicit Spanish override too (rare — the hardcoded text usually *is* the Spanish value), add `data-i18n-es="..."` as well.

### 3. Inline pairs with markup — `data-i18n-en-html` / `data-i18n-es-html`

Same as #2, but for text that contains inline HTML — a link, a `<br/>` — that a plain text swap would destroy. Used on the about-us paragraph (it has two Instagram links inside the translated sentence) and a few FAQ answers with `mailto:`/form links:

```html
<p data-i18n-en-html="Is an animation studio based in Mexico City, led by <a href=&quot;...&quot;>Andrea Mondragón</a>...">
  Es un estudio de animación de la CDMX, dirigido por <a href="...">Andrea Mondragón</a>...
</p>
```

Sets `innerHTML` instead of `textContent`. Because the value is itself inside an HTML attribute, any `"` inside it must be written as `&quot;`. This is a maintenance hazard — keep these to the minimum necessary, and double-check the escaping if you edit one by hand.

### Per-project technique value

The one piece of content that's genuinely different per project *and* needs translation (not a proper noun) is the "Técnica"/"Technique" value. It lives in `content/projects.json`:

```json
{ "dos-camaleones": { "technique": { "es": "Dibujo Animado", "en": "Animated drawing" } } }
```

Each project page's `<body>` carries `data-project-slug="dos-camaleones"`, and the technique `<p>` carries `data-technique-value`. `i18n.js` fetches `content/projects.json` once per page load and fills that element based on the slug.

## How to add a translation key

1. Decide: is this string reused elsewhere, or a one-off? Reused → `locales/*.json` + `data-i18n`. One-off → inline `data-i18n-en`.
2. If adding to `locales/*.json`: add the same key, in the same place in the object tree, to **both** `es.json` and `en.json`. A key that only exists in one file will silently fail to translate (not throw an error — `i18n.js` skips undefined lookups so the Spanish fallback keeps showing).
3. Add the `data-i18n="your.new.key"` attribute to the element.
4. Test both languages (see "Testing" below).

There's no build step — edit the JSON files directly and reload the page.

## How to add a language

This system currently supports exactly two languages, but the mechanism generalizes:

1. Add `locales/<code>.json` with the same key structure as `es.json`/`en.json`.
2. Add a third `<button class="lang-btn" data-lang="<code>">` to the switcher markup in `javascripts/functions.js` (`Header` class, search for `lang-switch`).
3. `i18n.js` doesn't need changes — `getLang()`/`applyLang()`/`loadLocale()` are already generic over the language code string. The one thing to check: `DEFAULT_LANG = "es"` at the top of `i18n.js` is intentionally hardcoded — Spanish must always stay the fallback per this project's requirements, so don't parameterize that constant even if you add more languages.
4. Every `data-i18n-en`/`data-i18n-en-html` inline pair only has two variants (`-es`/`-en`) — a third language can't use the inline mechanism as written. Anything that needs a third language should move to the shared `locales/*.json` key system instead.

## How to add a page

Follow `.agent.md`'s existing "Cómo Agregar Nuevos Proyectos" recipe for the non-i18n parts (create the HTML file, media folder, add it to `proyectos.html`'s grid). For i18n specifically, copy this pattern from any existing page's `<head>`:

```html
<!DOCTYPE html>
<html data-seo-key="your.page.key">

<head>
    <script>
        (function () {
            var lang = localStorage.getItem('casiopea-lang') || 'es';
            document.documentElement.setAttribute('lang', lang);
            if (lang !== 'es') document.documentElement.classList.add('i18n-pending');
        })();
    </script>
    <title>...</title>
    <meta charset='utf-8'>
    <meta name="description" content="...">
```

And before `</body>`, right after `functions.js`:

```html
<script src="javascripts/i18n.js" type="text/javascript"></script>
<!-- or "../javascripts/i18n.js" one level deep, e.g. inside /projects/ -->
```

If it's a new project page, also see `docs/content-guide.md` for the `content/projects.json` entry.

## How the content loader / translation-file loading works

There is no separate "content-loader.js" — `i18n.js` does both jobs (locale strings and the one piece of project content). On `DOMContentLoaded`, it:

1. Reads `localStorage.getItem('casiopea-lang')`, defaulting to `es`.
2. If the language is `es`: fetches `locales/es.json`, applies it (so the JSON stays the source of truth even though the HTML already shows the right text), and does nothing else — no FOUC handling needed since nothing was hidden.
3. If the language is not `es`: fetches the matching `locales/<lang>.json`, applies every `data-i18n*` binding, fetches `content/projects.json` if the page has a `data-project-slug`, then removes the `.i18n-pending` class that was hiding the page since before first paint.
4. Fetched JSON is cached in a module-level variable for the lifetime of that page load, so multiple elements don't trigger duplicate fetches. Because this is a traditional multi-page site (full reload between pages), that cache doesn't survive navigation — the real caching mechanism is the browser's HTTP cache on the static JSON files, which is a server/hosting concern, not something `i18n.js` controls.

## How language switching works

Clicking a `.lang-btn` in the header calls `applyLang(newLang, { persist: true })`, which:
1. Sets `<html lang="...">` immediately.
2. Updates the switcher's `aria-pressed` state.
3. Fetches (or reuses the cached) locale JSON and re-applies every binding — no reload.
4. Saves the choice to `localStorage` under the key `casiopea-lang`.
5. Announces the change via a screen-reader-only `aria-live="polite"` region (`#i18n-announcer` in the header) so assistive tech users get feedback that the page content changed without a navigation event.

## How localStorage works

Key: `casiopea-lang`. Values: `"es"` or `"en"`. Read on every page load (before first paint, via the inline `<head>` script) and written only when the user clicks a switcher button — never written on initial load, so visiting for the first time with no stored preference always shows Spanish and never touches `localStorage` until the user actually chooses English.

If `localStorage` is unavailable (private browsing, storage disabled), `i18n.js` catches the exception and falls back to treating every page load as a fresh Spanish visit — the language choice just won't persist across page loads, which is a graceful degradation, not an error.

## How the fallback works

If the `locales/<lang>.json` fetch fails for any reason (network issue, bad deploy, wrong path), `i18n.js`'s `.catch()` handler resets `<html lang>` back to `es` and reveals the page (removes `.i18n-pending`) showing whatever Spanish text was already hardcoded in the HTML. The page is never left blank or showing a mix of "some translated, some not" — it's all-or-nothing per the translation pass, and the untranslated-but-complete Spanish page is always the safe fallback state.

## How SEO translations work

Root pages (`index.html`, `about-us.html`, `proyectos.html`, `contacto.html`, `faq.html`, `404.html`) have `<html data-seo-key="home|about|projects|contact|faq|errors404">`. `i18n.js` looks up `seo.<key>.title` and `seo.<key>.description` in the active locale and, if present, overwrites `document.title` and the `<meta name="description">` tag. Project pages set `data-seo-key="project.<slug>"` but the corresponding `seo.project.*` entries are **not yet populated** in `locales/*.json` — see `docs/seo-content.md` for why this was scoped as optional, and add entries there if/when per-project SEO copy is written; no code changes needed, the lookup mechanism already supports it.

## Testing

There's no test suite (matches the rest of the project — no build tooling exists). To verify a change:
1. Serve the site locally (`python3 -m http.server 8000` or `php -S localhost:8000`, per `README.md`).
2. Load the page, confirm Spanish renders correctly with no flash/delay.
3. Click "EN" in the header, confirm the swap happens instantly with no reload, and that anything you added actually changed.
4. Reload the page — it should stay in English (localStorage persistence).
5. Check the browser console for errors.
6. If you touched `locales/*.json`, run a quick parity check that every key exists in both files — a small Python/Node script over the two JSON files' flattened key sets is the fastest way; see the QA script used for this project's own rollout in `docs/migration-report.md` if you need a starting point.
