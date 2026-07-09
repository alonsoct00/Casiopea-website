# Content Guide

How the site's actual content (as opposed to interface/translation strings — see `docs/i18n-guide.md` for those) is organized, and how to update it. This project deliberately did **not** move most content into JSON — see `docs/12-architecture-design.md` for why. This guide reflects what actually exists today.

## `content/projects.json`

The only structured content file in the project. One entry per project slug (matches the HTML filename without `.html`):

```json
{
  "dos-camaleones": {
    "technique": { "es": "Dibujo Animado", "en": "Animated drawing" }
  }
}
```

This is the **only** field stored here. Everything else about a project — title, client, year, credits, media — lives directly in that project's HTML file, because it's either a proper noun (not translated) or genuinely one-of-a-kind markup (the gallery). See "How new projects should be added" below.

To update a project's technique translation: edit the `es`/`en` pair for that slug directly. No other file needs to change.

## How navigation.json / footer.json "work"

They don't exist as separate files — this was a deliberate simplification from the original plan (see `docs/12-architecture-design.md` §2). Navigation and footer text are interface strings, not content, so they live in `locales/es.json` / `locales/en.json` under the `nav.*` and `footer.*` keys — see `docs/i18n-guide.md`. The *structure* of the nav (which links exist, in what order, pointing where) is still hardcoded directly in `javascripts/functions.js`'s `Header`/`Footer` Web Component templates, same as before this project started — only the translatable label text was extracted.

## How team.json "works"

It doesn't exist. `about-us.html` has a commented-out team bios section (4 people, photos, roles, short bios) that was never live on the site. Per an explicit decision made during this project, it was left commented out and untouched — not migrated to any content file, not translated. If it's ever re-enabled, it needs the same treatment as any other page content: proper-noun fields (names) stay as-is, translatable fields (role titles, bios) get either `data-i18n-en`/`data-i18n-en-html` inline or promoted to a real `content/team.json` if there's a reason to manage it centrally at that point.

## How multilingual content is stored

Two patterns, and only two:

1. **`{ "es": "...", "en": "..." }` pairs inside a JSON file** — currently only used in `content/projects.json`, for the technique field.
2. **Inline `data-i18n-en`/`data-i18n-en-html` attributes directly on the HTML element**, with the Spanish value being the element's actual visible content — used for everything else that varies (project credit labels, FAQ answers, the about-us paragraph, the "Regresar"/"Back" link).

There is intentionally no third pattern (no generic "content blocks" system, no page-builder-style JSON-driven rendering). If a future content type needs real structure (e.g. if the site adds a blog), decide then whether it's simple enough for the inline-attribute pattern or complex enough to warrant a new dedicated JSON file + a small loader function in `i18n.js` — don't build a generic system speculatively.

## How new projects should be added

Combine `.agent.md`'s existing "Cómo Agregar Nuevos Proyectos" section (non-i18n parts: HTML file, media folder, gallery tile in `proyectos.html`) with these i18n-specific steps:

1. Copy an existing project page close to the new one in complexity (e.g. `projects/dos-camaleones.html` for a page with a full credits list) as your starting template rather than starting from the minimal skeleton in `.agent.md` — it already has all the i18n wiring correctly in place.
2. Set `data-project-slug="your-new-slug"` on `<body>` (must match the JSON key you'll add in step 5 and the HTML filename).
3. For every `<dt>Role:</dt>` credit label, add `data-i18n-en="English Role:"`. Check `docs/content-inventory.md` §B for the existing 55-label dictionary first — many roles repeat across projects (Dirección, Producción, Animación, etc.) and should use the same English wording other pages already use, for consistency.
4. Leave `<h4 data-i18n="projects.client">Cliente</h4>`, `<h4 data-i18n="projects.year">Año</h4>`, `<h4 data-i18n="projects.techniqueLabel">Técnica</h4>` and `<h3 data-i18n="projects.otherProjects">Otros Proyectos</h3>` exactly as they appear in the template you copied — these are shared keys, don't change them per-project.
5. Add `<p data-technique-value>...</p>` for the technique value, and add the matching entry to `content/projects.json`:
   ```json
   "your-new-slug": { "technique": { "es": "...", "en": "..." } }
   ```
6. Names, client names, and the project title stay untouched — no `data-i18n*` attributes, they're proper nouns per this project's translation policy.
7. Gallery media (images/videos/Lottie/YouTube embeds) needs no i18n treatment at all — it's language-agnostic. Only add `data-i18n-alt`/`data-i18n-en` if a specific image's `alt` text is actually descriptive prose worth translating (most are empty or decorative today).
8. `<html data-seo-key="project.your-new-slug">` — the lookup mechanism exists but no project currently has real `seo.project.*` copy in the locale files (see `docs/seo-content.md`); add an entry there if you want a real per-project SEO title/description, otherwise the page just falls back to the hardcoded `<title>`.

## How to update contact information

Contact emails (`somos@casiopea.mx`, `ss@casiopea.mx` on `contacto.html`; `hicasiopea@gmail.com`, `somoscasiopea@gmail.com` in `faq.html`) are plain `mailto:` links in the HTML — edit them directly where they appear. They are not translated (email addresses don't need translation) and are not centralized in any content file. If they ever need to be centralized (e.g. to avoid editing 2+ files when an address changes), that would be a reasonable use of a small `content/site-settings.json`, but that file doesn't exist today because there was no reuse pressure to justify it yet.

The PHP form handler's recipient address (`php/email.php`, `$to = 'somoscasiopea@gmail.com'`) is separate from the addresses shown on the page — update both if the studio's contact email changes.
