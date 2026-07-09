# 07 — Content Map (high-level; full string extraction is Phase 2)

This is a map of *where* translatable content lives, categorized by whether it belongs in `/locales/` (interface strings, reused across pages) or `/content/` (page/entity-specific data), per the Phase 5 architecture. The exhaustive line-by-line inventory with suggested JSON keys is Phase 2 (`docs/content-inventory.md`) and was intentionally deferred — this map is the scoping pass that Phase 2 will expand.

## Interface strings → `/locales/es.json` + `/locales/en.json`

| Key area | Source | Approx. string count |
|---|---|---|
| `navigation.*` | `<main-header>` in functions.js | 4 nav labels + 8 filter labels = 12 |
| `footer.*` | `<main-footer>` in functions.js | 1 (copyright line; social links are icon-only) |
| `contact.form.*` | contacto.html form | 5 placeholders + 1 button + 3 JS feedback states (validation.js) = 9 |
| `contact.info.*` | contacto.html body | 2 instructional paragraphs |
| `projects.credits.*` | shared across all 22 project pages | ~8 label variants (Dirección, Dirección de arte, Producción, Arte, Animación, Color, Compuesto, Guión — not all appear on every project) |
| `projects.meta.*` | shared across all 22 project pages | 3 (Cliente, Año, Técnica labels) |
| `projects.otherProjects` | shared, "Otros Proyectos" heading + "Regresar" link | 2 |
| `common.*` (title suffixes, generic UI) | `<title>` patterns, `alt` fallback conventions | small, TBD in Phase 2 |
| `errors.404.*` | 404.html | 2 (currently English-only, see docs/04) |

## Page/entity content → `/content/*.json`

| File | Source page(s) | Contains |
|---|---|---|
| `content/navigation.json` | functions.js Header | Structural nav tree (labels come from locales, hrefs/filters stay as data) |
| `content/footer.json` | functions.js Footer | Social link URLs |
| `content/home.json` | index.html | Hero video paths (not really "content" — mostly static, may not need a JSON at all) |
| `content/about.json` | about-us.html | Studio description paragraph (bilingual `{es, en}` object), director names + Instagram links, and — pending a decision from the user — the currently-commented-out team bios (4 people: role, bio, photo, social link) |
| `content/contact.json` | contacto.html | The two contact emails + their instructional sentences (bilingual) |
| `content/faq.json` | faq.html | ~10 Q&A pairs (bilingual), each with its associated image |
| `content/projects.json` | proyectos.html + all 22 project pages | One entry per project: slug, title, category/categories, client, year, technique, credits (role→people map), media paths (hero video/poster, gallery items in original order), and which category filter classes apply |
| `content/categories.json` | functions.js filter submenu | Category id ↔ label mapping (labels pull from locales; the 2 unused categories "Talleres"/"Visuales" should be included since removing them wasn't requested) |
| `content/site-settings.json` | scattered (favicon, social URLs, brand name) | Small settings object, mostly non-translatable |

## Notable open questions for the user before Phase 2/5 proceed

1. **about-us.html team section is commented out** — should its 4 bios be included in the content inventory/translation work, or left disabled and untouched?
2. **404.html is already in English** — translate it properly with an ES/EN pair like everything else, or leave the existing English text as the "content" for both languages (since it's arguably language-neutral)?
3. **"Talleres" and "Visuales" filter categories have zero matching project tiles today** — include in the new categories.json as dead/future categories, or drop them? (Recommend: keep, since dropping is a scope decision beyond i18n and not requested.)
4. **Gallery section per project page is hand-assembled with no consistent order/pattern** (mix of video/picture/lottie/iframe in arbitrary sequence) — Phase 7's content loader needs a generic "media block" schema flexible enough to represent any of these four types in any order, per project. This is worth designing carefully before Phase 6 starts, since it's the least template-like part of the site.
