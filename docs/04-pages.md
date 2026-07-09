# 04 — Page Anatomy

All pages share the same `<head>` boilerplate (Google Fonts, 4 stylesheets, IE9 fallback comment) and the same script list at the end of `<body>` (jQuery + plugins + `functions.js`). Differences are noted per page below.

## index.html — Home

- `<title>CASIOPEA</title>` (generic, not descriptive)
- Body id: `main-home-page`
- Single hero section (`#home-hero-top`): full-bleed autoplay video, no text overlay
- Video source chosen client-side by viewport width (inline `<script async>` at the bottom, lines 58-71): desktop `videos/REEL_INICIO_V02.mp4/.mov` vs mobile `videos/REEL2026_WEB_VERTICAL_V03.mp4/.mov`
- No other content — this page carries almost no translatable text of its own beyond the header/footer.

## about-us.html — About

- `<title>CASIOPEA - Nosotros</title>`
- Body id: `main-aboutus-page`
- Hero: responsive `<picture>` (mobile/desktop, webp+fallback), `alt="CASIOPEA Nosotros"`
- One purple content block (`#about-us`) with the studio description paragraph — the site's main "about" copy, in Spanish, with inline links to the two directors' Instagram profiles
- A **fully commented-out** "our team" section (lines 64-173): 4 profile cards (Alexandra Castellanos, Andrea Mondragón, Ana Cruz, Sandra Medina) each with photo, role button (Bootstrap `collapse`), and bio paragraph. This is dead markup today — not rendered — but contains real translatable content if it's ever re-enabled. Flag for the user: should this be included in the content inventory (Phase 2) even though it's disabled?

## proyectos.html — Project Gallery

- `<title>` not yet inspected in full but follows `CASIOPEA - ...` pattern
- Grid of `<li class="item">` project tiles (Isotope-managed), each:
  - `<a href="projects/[slug].html">`
  - Background image via inline `style="background:url(...)"` pointing at `projects/images/home-projects/`
  - A caption `<div>` with the hardcoded Spanish/mixed project title
- Category filter submenu lives in `<main-header>`, not on this page — filtering is triggered by `data-filter` anchors dispatching Isotope filter calls (`functions.js:120-129`)
- ~22 project tiles map 1:1 to the 22 project pages in `/projects/`

## contacto.html — Contact

- `<title>CASIOPEA - Contacto</title>`
- Body id: `contact-page`
- One `<form>` (`action="php/email.php" method="POST"`) with fields: `name`, `email`, `phone` (optional), `subject`, `message`; submit button text "Enviar"
- Below the form: two more `<p>` blocks giving direct-contact emails (`somos@casiopea.mx` for work, `ss@casiopea.mx` for internships), each with its own instructional sentence
- Client validation via `validation.js` (see docs/11 for a bug: it toggles a `.msg` element that doesn't exist in the DOM)
- Full analysis of the form (fields, bugs, backend) is in the exploration notes — see docs/07 and docs/11 for the i18n-relevant and defect-relevant excerpts respectively.

## faq.html — FAQ

- `<title>` follows the same pattern; uses `stylesheets/style.css` (unminified) instead of `style.min.css` — the only root page to do so
- Structured as a series of image+text Q&A blocks (~10 questions) covering: origin of the name "Casiopea", their process (7 steps), tech/tools, pricing approach, timelines
- Uses `images/faqs/*.webp` with lazy-loading (`data-src`)

## 404.html — Error Page

- `<title>CASIOPEA - Ops! 404</title>`
- Body has **no id attribute** (only page missing one)
- Content: `<h1>You've reached an empty space</h1>` / `<h2>Error 404. Page not found!</h2>` — **already in English**, unlike every other page. This needs a decision during translation: keep as-is (it's arguably fine either language) or add a Spanish default + English variant like everything else, for consistency.

## Project page template (applies to all 22 pages in `/projects/`)

Verified against `dos-camaleones.html` in full, cross-checked structurally against `birdsong.html` and `animasivo.html`. All project pages:

1. Live one directory deeper than root (`/projects/*.html`), so all internal asset/script paths use `../` prefixes, **except** the header nav links — those are relative (`index.html`, not `../index.html`) as written in `functions.js`, and get corrected at runtime by a **per-page inline script** appended at the very end of the body:
   ```js
   $("a.h-link").each(function() {
     var $this = $(this);
     var _href = $this.attr("href");
     $this.attr("href", '../' + _href);
   });
   ```
   This patch must be preserved exactly if the header component is later modified for i18n — any new nav links added to the header (e.g. a language switcher, if it were an `<a>`) would also get `../` prepended when rendered inside a project page.
2. Load `<lottie-player>` script from `unpkg.com` (CDN, `async`)
3. Hero: full-bleed video (`.jumbotron`) with a poster image and `<h1 class="intro-project-title">` overlay showing the project name
4. Info block (`#info-project-txt`): a `<dl>` of Spanish-labeled credits (`Dirección:`, `Dirección de arte:`, `Producción:`, `Arte:`, `Animación:`, `Color:`, `Compuesto:`, `Guión:` — labels vary somewhat per project depending on what roles applied) plus `Cliente`, `Año`, `Técnica` in side columns
5. Gallery/demo section (`#project-work-demos`): a manually ordered mix of `<video>`, `<picture>` (lazy-loaded webp), `<lottie-player>`, and occasional YouTube `<iframe>` embeds — **no two project pages have the same gallery layout**, each is hand-assembled
6. "Otros Proyectos" section: heading + an empty `<ul id="grid">` that `functions.js` populates by inserting a "Regresar" (back) link (`functions.js:227`) — this appears to be a partial/incomplete "related projects" feature (the grid is otherwise never filled)
7. Same footer/scripts as every other page

**i18n-relevant takeaway**: credit labels (`Dirección:`, `Producción:`, etc.) are the single most repeated piece of translatable text across the whole site (used in some form on all 22 project pages) and are excellent candidates for a shared translation key (e.g. `projects.credits.direction`) rather than per-project duplication — but the credit **values** (people's names, client names) are project-specific data and belong in per-project content JSON, not translation files.
