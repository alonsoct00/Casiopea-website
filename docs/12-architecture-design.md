# 12 — Architecture Design (Phase 4)

This document proposes the concrete i18n architecture, explains every decision, and flags the one place where this proposal deliberately narrows the scope described in the original task brief — because implementing it literally would mean restructuring 22 hand-built project pages into a generic renderer, which conflicts with the brief's own top-level rule: *"Never rewrite the project unnecessarily... preserve the existing architecture whenever possible... Do NOT duplicate HTML."* Read this whole document before Phase 5/6 implementation starts; the recommendation at the end needs your sign-off.

## 1. The core finding that shapes this design

Looking at the actual content (docs/07-content-map.md), most of what varies per project is **proper nouns that should not be translated**: people's names, client names, project titles. What genuinely needs an ES/EN pair is a much smaller set:

- Site chrome: nav labels, filter labels, footer copyright, form labels/placeholders/buttons, validation feedback, FAQ Q&A, the about-us paragraph, contact instructions, 404 text — call this **~40-50 strings total**, all either shared across pages or long-form prose on a handful of pages.
- Per-project **credit labels** ("Dirección:", "Producción:", "Técnica", "Cliente", "Año:" — with some spelling/casing variance already present, e.g. `birdsong.html` uses "Dirección de Arte:" vs `animasivo.html`'s different label set) — these are a small closed vocabulary (~10-12 distinct labels across all 22 pages) that repeats, not per-project content.
- Per-project **technique value** (e.g. "Dibujo Animado", "Stop Motion") — this is the one piece of truly project-specific text that needs a translation, since it's a real word/phrase, not a proper noun.
- Everything else per project (names, client, gallery images/videos, Lottie animations, YouTube embeds) is **language-agnostic** and should not move anywhere.

This means a full `content/projects.json`-driven re-render of the project template (as sketched in the original Phase 5 brief) would be solving a problem that mostly isn't there — at the cost of touching 22 pages' full markup, which is exactly the "unnecessary rewrite" the brief also warns against, and the highest-risk part of this whole project for introducing visual regressions.

**Recommendation: a leaner hybrid** — described below — that gets 100% of the actual translation coverage with a fraction of the structural change. I'll implement the literal full-JSON version instead if you prefer strict adherence to the original Phase 5 file list; flagging this now because it changes how much of the site gets touched.

## 2. Proposed file layout

```
/locales/
  es.json        interface strings — nav, footer, forms, FAQ, about, contact, 404, project credit labels
  en.json        same key structure, English values

/content/
  faq.json       {es:[...], en:[...]} — only place where long-form bilingual prose lives outside locales
  projects.json  one entry per project: slug → { technique: {es, en} }  ← intentionally tiny, see §1
  site-settings.json   non-translatable: social URLs, contact emails (kept out of HTML per the brief's spirit, optional)

/javascripts/
  i18n.js            core: locale detection, localStorage, data-i18n DOM binder, lang attribute sync
  content-loader.js  fetches /content/*.json, renders FAQ list + injects project technique value
  functions.js       UNCHANGED file location; Header/Footer components get data-i18n attributes added
                      inline in their template strings (see §4) — no new components.js needed, since
                      introducing one would mean splitting a working file for no functional gain
```

**Why `/javascripts/` and not `/js/` as the brief suggested**: the project already has an established `javascripts/` convention referenced throughout README.md, .agent.md, and all 29 HTML files' `<script src="javascripts/...">` tags. Renaming the folder would touch every page's script tags for a cosmetic reason and contradicts "preserve the existing architecture whenever possible." Keeping the existing folder name and just adding two new files there is the lower-risk choice.

**Why no separate `content/navigation.json` / `content/footer.json` / `content/about.json` / `content/contact.json`**: these are small enough (a handful of keys each) that splitting them into per-domain content files adds file-fetch overhead and indirection without a real reuse benefit — they're used on one component or one page each. They fold into `locales/{es,en}.json` under namespaced keys (`nav.*`, `footer.*`, `about.*`, `contact.*`) since they're pure interface/prose text, not structured data with a schema. `faq.json` gets its own file only because it's a list of ~10 repeated-shape objects (a real data structure, not prose lines), and `projects.json` gets its own file for the same reason (repeated shape, one entry per project) even though right now the only field in it is `technique`.

## 3. Locale file shape

```json
// locales/es.json
{
  "nav": { "home": "Inicio", "about": "Quiénes somos", "projects": "Proyectos", "contact": "Contacto" },
  "filters": { "all": "All", "motionGraphics": "Motion graphics", "stopMotion": "Stop motion",
               "animatedCartoons": "Dibujo animado", "videoIntervened": "Video intervenido",
               "fonima": "Fonima", "workshops": "Talleres", "visuals": "Visuales" },
  "footer": { "copyright": "© {{year}} Casiopea. Todos los derechos reservados." },
  "contact": {
    "form": { "name": "Nombre", "email": "E-mail", "phone": "Teléfono", "subject": "Asunto",
               "message": "Mensaje", "send": "Enviar", "sending": "Enviando", "thanks": "¡Gracias!", "error": "¡Error!" },
    "workInquiry": "¡Trabajemos juntxs! Si tienes algún proyecto y quieres colaborar con nosotras escríbenos a:",
    "internships": "Si te interesa hacer el servicio social o prácticas profesionales, envía tu portafolio o reel y los requerimientos de tu escuela a:"
  },
  "about": { "title": "Casiopea", "body": "Es un estudio de animación de la CDMX..." },
  "projects": {
    "credits": { "direction": "Dirección:", "artDirection": "Dirección de arte:", "production": "Producción:",
                  "art": "Arte:", "animation": "Animación:", "color": "Color:", "compositing": "Compuesto:",
                  "script": "Guión:", "soundDesign": "Diseño sonoro:", "stopMotionArt": "Arte Stop Motion:" },
    "client": "Cliente", "year": "Año", "technique": "Técnica",
    "otherProjects": "Otros Proyectos", "back": "Regresar"
  },
  "errors404": { "heading": "Has llegado a un espacio vacío", "sub": "Error 404. Página no encontrada" },
  "seo": { "home": { "title": "CASIOPEA — Estudio de animación en CDMX", "description": "..." }, "...": "..." }
}
```

`en.json` mirrors every key. Both files are hand-maintained JSON — no build step, matching the rest of the site.

**Note on the {{year}} token and the 404/footer decision you already made**: per your answer, the footer copyright and 404 text get proper Spanish defaults with English translations (both currently exist only in English). The `{{year}}` placeholder means i18n.js needs a tiny interpolation step (simple `{{key}}` string replace, not a templating library) — the only bit of "logic" beyond key lookup.

## 4. `data-i18n` binding convention

```html
<!-- text content -->
<a class="h-link" href="index.html" data-i18n="nav.home">Inicio</a>

<!-- attributes -->
<input placeholder="Nombre" data-i18n-placeholder="contact.form.name" ...>
<img alt="CASIOPEA Nosotros" data-i18n-alt="about.heroAlt" ...>
<a class="icon fa fa-vimeo" data-i18n-aria-label="footer.social.vimeo" href="..."></a>
```

Rules:
- The element's existing Spanish text/attribute stays in the markup as-is — it's the fallback/default and what every page already shows. `i18n.js` only **overwrites** it when the active locale isn't Spanish, or when locale is explicitly `es` but a value differs from the hardcoded default (keeps a single source of truth in JSON going forward without requiring the HTML to be blanked out).
- One generic attribute per translatable HTML attribute (`data-i18n-alt`, `data-i18n-title`, `data-i18n-aria-label`, `data-i18n-placeholder`, `data-i18n-value`) rather than one combined mini-DSL — easier to grep, easier to read, matches the codebase's plain/explicit style (no LESS mixin-style cleverness anywhere in this project either).
- `data-i18n` on the Header/Footer Web Component templates works exactly the same way as on static HTML, since `connectedCallback()`'s `innerHTML` assignment happens before `i18n.js`'s DOM pass runs (i18n.js runs on `DOMContentLoaded`, same as the existing lazy-load init in `functions.js:253`, so ordering is already safe).

## 5. Language detection, persistence, and FOUC prevention

```html
<!-- in <head>, BEFORE any stylesheet/script — blocking, tiny -->
<script>
  (function() {
    var lang = localStorage.getItem('casiopea-lang') || 'es';
    if (lang !== 'es') {
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.classList.add('i18n-pending'); // CSS hides <body> until i18n.js finishes
    } else {
      document.documentElement.setAttribute('lang', 'es');
    }
  })();
</script>
```
```css
/* the-casiopea-styles.css, added rule */
html.i18n-pending body { visibility: hidden; }
```

Why this shape:
- **Spanish is the default and is already what's hardcoded in every page**, so the zero-cost path (no `localStorage` entry, or explicitly `es`) never hides anything — no added flash, no added risk, matching "Spanish MUST ALWAYS be the default language" and "never sacrifice... prioritize clean architecture" while adding the least possible new behavior to the common case.
- Only the English path needs FOUC prevention, since only that path shows different text than what's already painted in the HTML.
- The blocking inline script is ~6 lines, runs before CSS/JS parsing blocks anything further, and is the standard pattern for this exact problem (compare: dark-mode flash prevention scripts, which use the identical technique).
- `i18n.js` (loaded normally at the bottom with the other scripts, non-blocking) does the real work on `DOMContentLoaded`: fetch `locales/en.json` (or reuse a cached copy — see §6), walk all `[data-i18n]`/`[data-i18n-*]` elements, apply translations, then remove `.i18n-pending` from `<html>` to reveal the page. If the fetch fails, it removes `.i18n-pending` immediately and leaves the Spanish defaults showing — this is the required "fallback to Spanish, never display untranslated content" behavior, and it falls out naturally rather than needing special-case error handling.

## 6. Caching

Per Phase 12 of the brief ("load translation files only once"): since this is a traditional multi-page site (full page reload on navigation, no client-side router), a JS in-memory cache cannot survive navigation. The realistic mechanism is **HTTP caching** — serve `/locales/*.json` and `/content/*.json` with a normal `Cache-Control` header (this is a static-file-serving concern, not something `i18n.js` controls, so it's a one-line note for whoever configures the Hostinger deploy, not application code). Within a single page's lifetime, `i18n.js` keeps one fetched object in a module-level variable so multiple `data-i18n` elements on the same page don't trigger duplicate fetches.

## 7. Language switcher placement

Added inside `<main-header>`'s template string in `functions.js`, next to (not replacing) the hamburger trigger, as a small `ES | EN` toggle:

```html
<div class="lang-switch" role="group" aria-label="Language / Idioma">
  <button type="button" class="lang-btn" data-lang="es" aria-pressed="true">ES</button>
  <button type="button" class="lang-btn" data-lang="en" aria-pressed="false">EN</button>
</div>
```

- Real `<button>` elements (not bare `<span>`/`<div>`) for native keyboard/focus/AT support, addressing the accessibility gap noted in docs/09.
- Deliberately **not** given the `h-link` class, so it doesn't get caught by the page-fade-and-navigate handler in `functions.js:190-214`, and doesn't get the `../` prefix rewrite that project pages apply to `a.h-link` elements (docs/06) — it's a same-page action, not a navigation.
- Click handler: set `localStorage.setItem('casiopea-lang', lang)`, toggle `aria-pressed`, update `<html lang>`, and re-run the same DOM-translation pass `i18n.js` uses on load (no reload, no URL change — matches the brief's explicit requirements).
- Desktop and mobile use the same markup; existing responsive nav CSS (`the-casiopea-styles.css`) gets a small new rule block for `.lang-switch`, sized to sit naturally next to the hamburger icon — actual visual placement to be verified in-browser once implemented (Phase 13 QA), not guessed at in this document.

## 8. What does NOT change under this design

- No project page's HTML structure, gallery markup, or media loading is touched, beyond wrapping the ~4-6 label text nodes per page (credit `<dt>`/`<h4>` labels, "Otros Proyectos", "Regresar") in `data-i18n` attributes and adding a `data-i18n="projects.<slug>.technique"`-style hook (or a plain inline `data-i18n-technique-es`/`en` pair — see open question below) on the one technique value per page.
- No JS library is introduced (no i18next). Everything is hand-rolled, matching "Vanilla JavaScript only" and the codebase's existing style of small, dependency-free custom scripts (`tera-slider.js`, `tera-lightbox.js`, `validation.js` are all similarly self-contained).
- Isotope filtering, the hash-based deep-link handler, the lazy-load system, and the header nav's `../` path-rewrite on project pages all keep working unmodified — `i18n.js` only adds text, it never restructures the DOM tree those systems depend on.

## 9. Open question for you before implementation starts

How should the 22 project pages' **technique value** (the one true per-project translatable string) be sourced?

- **Option A — inline dual-attribute** (`<p data-i18n-es="Dibujo Animado" data-i18n-en="Cartoon">Dibujo Animado</p>`): zero new files, keeps everything local to the page being edited, but means translations live scattered across 22 files instead of one place.
- **Option B — `content/projects.json`** (`{ "dos-camaleones": { "technique": { "es": "Dibujo Animado", "en": "Cartoon" } } }`, looked up by `<body id>` or a new `data-project-slug` attribute): one central file, easier to audit/translate in one pass, but requires a fetch + one small JS lookup on project pages specifically.

Recommend **B** for consistency with the FAQ file and because Phase 8 (translation) will be easier to execute from one file than 22. Will proceed with B unless you'd rather keep it inline.

---

Once you confirm the hybrid approach (vs. the fully JSON-driven original Phase 5 spec) and the technique-value question above, next step is Phase 2 (full content inventory, now scoped down per §1) followed directly by Phase 6 implementation.
