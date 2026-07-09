# Content Inventory (Phase 2, scoped to the approved hybrid architecture)

This inventory lists every string that needs an ES/EN pair, organized by where it will live per `docs/12-architecture-design.md`. It does **not** reproduce full paragraph text verbatim for every long-form block (FAQ answers, the about-us paragraph) — those are translated directly in place during Phase 6/8 by editing the HTML/JSON, since copying multi-sentence prose into this doc and then into the real files would mean maintaining the same text in two places for no benefit. What's listed here is the **complete key structure** plus short representative excerpts, which is what implementation actually needs.

## A. `locales/{es,en}.json` — shared interface strings

| Key | ES (current, hardcoded today) | Source |
| --- | --- | --- |
| `nav.home` | Inicio | functions.js:25 |
| `nav.about` | Quiénes somos | functions.js:28 |
| `nav.projects` | Proyectos | functions.js:31 |
| `nav.contact` | Contacto | functions.js:60 |
| `filters.all` | All | functions.js:34 |
| `filters.motionGraphics` | Motion graphics | functions.js:37 |
| `filters.stopMotion` | Stop motion | functions.js:40 |
| `filters.animatedCartoons` | Dibujo animado | functions.js:43 |
| `filters.videoIntervened` | Video intervenido | functions.js:46 |
| `filters.fonima` | Fonima | functions.js:49 |
| `filters.workshops` | Talleres | functions.js:52 |
| `filters.visuals` | Visuales | functions.js:55 |
| `footer.copyright` | © {{year}} Casiopea. Todos los derechos reservados. | functions.js:83 (currently English-only, per your decision gets a Spanish default) |
| `footer.social.vimeo` / `.behance` / `.facebook` / `.instagram` / `.youtube` | (new — aria-labels, didn't exist before) | functions.js:76-80 |
| `contact.form.name` | Nombre | contacto.html:41 |
| `contact.form.email` | E-mail | contacto.html:42 |
| `contact.form.phone` | Teléfono | contacto.html:43 |
| `contact.form.subject` | Asunto | contacto.html:44 |
| `contact.form.message` | Mensaje | contacto.html:46 |
| `contact.form.send` | Enviar | contacto.html:49 |
| `contact.form.sending` / `.thanks` / `.error` | Sending / Thank you! / Error! (currently English-only in validation.js) | validation.js — see note below |
| `contact.title` | ¿Tienes un proyecto? Escríbenos: | contacto.html:39 |
| `contact.workInquiry` | ¡Trabajemos juntxs! Si tienes algún proyecto... | contacto.html:61 |
| `contact.internships` | Si te interesa hacer el servicio social... | contacto.html:75 |
| `about.title` | Casiopea | about-us.html:55 |
| `about.body` | Es un estudio de animación de la CDMX... (full paragraph, translated in place) | about-us.html:56-59 |
| `about.heroAlt` | CASIOPEA Nosotros | about-us.html:40 |
| `projects.client` | Cliente | shared `<h4>` label, all 22 project pages |
| `projects.year` | Año | shared `<h4>` label, all 22 project pages (some pages write "Año:" with colon — normalize during Phase 6 edit, cosmetic only) |
| `projects.techniqueLabel` | Técnica | shared `<h4>` label, all 22 project pages |
| `projects.otherProjects` | Otros Proyectos | shared `<h3>`, all 22 project pages |
| `projects.back` | Regresar | functions.js:227, injected via JS |
| `errors404.heading` | You've reached an empty space → needs Spanish default per your decision: "Has llegado a un espacio vacío" | 404.html |
| `errors404.sub` | Error 404. Page not found! → Spanish default: "Error 404. Página no encontrada" | 404.html |
| `seo.<page>.title` / `.description` | (new — every page gets one, fixing the broken `name=''` bug from docs/08) | all pages |

**Validation feedback strings note**: `validation.js` currently sets `$('#send').text('Sending')`/`'Thank you!'`/`'Error!'` directly in JS (not in HTML), all in English already. Per your decision (English-only spots get a proper Spanish default), these three need Spanish defaults added and the JS updated to read from `locales` via `i18n.js` rather than hardcoding English.

## B. Project credit labels — inline dual-attribute (revised from the architecture doc's original plan)

**Finding during extraction**: the credit labels are **not** a small shared vocabulary of ~10 terms as estimated in `docs/12-architecture-design.md` §1 — a full pass across all 22 project pages found **~55 distinct label strings** (see raw list below), many unique to a single project (e.g. "Diseño Tipográfico:", "Puppet:", "Gaffer:", "Ingeniero de Sonido:", "Colorista:", "Identidad gráfica:", "Locución:"). Forcing these into a shared `projects.credits.*` key namespace in `locales/*.json` would mean managing ~55 keys, most used exactly once — that's not meaningfully different from keeping them local to each page.

**Revised approach**: credit `<dt>` labels get translated via **inline dual attributes** directly on each element, e.g.:

```html
<dt data-i18n-en="Direction:">Dirección:</dt>
```

This needs no key management, no JSON growth, and keeps each project page self-contained (consistent with "preserve existing architecture" — these pages are already independent, hand-edited files). The genuinely shared labels — **Cliente/Año/Técnica** (appear near-verbatim on all 22 pages) and **Otros Proyectos/Regresar** (identical everywhere) — stay in `locales/*.json` as originally planned, since those really are one shared string reused 22+ times.

Full raw label list found (for reference during Phase 6 editing, one `data-i18n-en` per element, translated in place):
Dirección, Dirección de arte, Dirección de Arte, Storyboard, Producción, Arte, Asistencia, Animación, Realización, Arte Stop Motion, Diseño sonoro, Compuesto, Fotografía, Arte y Animación, Diseño Tipográfico, Producción y dirección de videoclip, Música, Dirección y Producción, Arte y animación, Música y Diseño Sonoro, Locución, Identidad gráfica, Guión, Dirección y producción, Historia, Dirección y coordinación de animación, Coordinación de Arte, Layout de Animación, Animación 2D, Clean-up, Dirección y realización de arte, Asistencia de animación, Historia original, Coproducción, Producción Micufilm, Audio, Dirección de animación, Diseño de personaje, Dirección y realización, Color, Guión y Dirección, Dirección de Animación, Layout, Animación Stop motion, Animación 3D, Asistente de arte, Mezcla de Sonido y corrección de color, Ingeniero de Sonido, Colorista, Administración, Coreografía, Asistente de animación, Puppet, Fotógrafo, Gaffer, Animación y compuesto.

**Post-implementation correction**: `Realización` (used standalone in `ambulante.html` and `franz-mayer.html`, alongside *separate* `Dirección`/`Producción` entries in the same credits list) was initially mistranslated as "Direction and production:" — duplicating the meaning of the two other entries already in the same list. Corrected to **"Realization:"**, a distinct standard film-credit term. Also found and fixed one label missed entirely by the batch pass: `now-within.html` has a bare `<h4>Producción</h4>` (production company slot, substituting for the usual Cliente label) outside the `<dl>` credits block — the batch script only targeted `<dt>` tags and the Cliente/Año/Técnica pattern, so this one-off case was invisible to it. Now `data-i18n-en="Production"`.

## C. `content/projects.json` — per-project technique value

Per your decision, technique values are centralized here (looked up by a new `data-project-slug` attribute on each project page's `<body>`):

```json
{
  "dos-camaleones": { "technique": { "es": "Dibujo Animado", "en": "Animated drawing" } },
  "abuelitas-kitchen": { "technique": { "es": "Digital", "en": "Digital" } },
  "ambulante": { "technique": { "es": "Digital/Stop Motion", "en": "Digital/Stop motion" } },
  "animasivo": { "technique": { "es": "Dibujo Animado, Stop Motion, Rotoscopia", "en": "Animated drawing, stop motion, rotoscoping" } },
  "ben-and-frank": { "technique": { "es": "Stop motion, animación y compuesto digital", "en": "Stop motion, animation and digital compositing" } },
  "birdsong": { "technique": { "es": "Motion Graphics", "en": "Motion Graphics" } },
  "campanias": { "technique": { "es": "Digital/Stop Motion", "en": "Digital/Stop motion" } },
  "centavrvs": { "technique": { "es": "Dibujo Animado", "en": "Animated drawing" } },
  "cutout-fest": { "technique": { "es": "Dibujo Animado", "en": "Animated drawing" } },
  "franz-mayer": { "technique": { "es": "Digital", "en": "Digital" } },
  "hise": { "technique": { "es": "", "en": "" } },
  "kidoo": { "technique": { "es": "2D Digital", "en": "2D Digital" } },
  "la-catrina": { "technique": { "es": "Motion Grpahics", "en": "Motion Graphics" } },
  "macmillan": { "technique": { "es": "Digital", "en": "Digital" } },
  "no-se-aceptan-devoluciones": { "technique": { "es": "Stop Motion", "en": "Stop Motion" } },
  "now-within": { "technique": { "es": "2D Digital", "en": "2D Digital" } },
  "poliangular": { "technique": { "es": "Dibujo Animado, Stop Motion, 3D", "en": "Animated drawing, stop motion, 3D" } },
  "smmx": { "technique": { "es": "Stop Motion", "en": "Stop Motion" } },
  "song-last-lacandon": { "technique": { "es": "Digital", "en": "Digital" } },
  "the-impossible-dream": { "technique": { "es": "Mixta", "en": "Mixed media" } },
  "the-river-kon": { "technique": { "es": "2D Digital", "en": "2D Digital" } },
  "video-explicativo": { "technique": { "es": "", "en": "" } }
}
```

Notes:

- `hise.html` and `video-explicativo.html` had an empty `<p></p>` where technique normally goes — pre-existing content gap, not something to invent text for. Left blank in both languages; flag to the user/content owner separately if they want it filled in (out of scope for a translation project to author new facts).
- `la-catrina.html` has a typo in the source ("Motion Grpahics") — carried into `es` as-is (translation work shouldn't silently "fix" the Spanish source; that's a separate content edit) and corrected to proper English rather than propagating the typo into `en`.

## D. `content/faq.json` — FAQ Q&A pairs

~10 question/answer pairs, structure:

```json
[
  { "id": "why-casiopea", "question": {"es": "¿Por qué Casiopea?", "en": "..."},
    "answer": {"es": "En la mitología griega, Casiopea fue una mujer que...", "en": "..."} },
  { "id": "process", "question": {"es": "¿Cuál es su proceso?", "en": "..."}, "answer": {...} },
  { "id": "services", "question": {...}, "answer": {"es": "Hemos realizado animación para cortometrajes...", ...} },
  { "id": "techniques", "question": {...}, "answer": {"es": "Principalmente hacemos animación 2D cuadro a cuadro...", ...} },
  { "id": "location", "question": {...}, "answer": {"es": "Nos encontramos en la Ciudad México...", ...} },
  { "id": "join-team", "question": {...}, "answer": {"es": "Envíanos tu reel y/o portafolio...", ...} },
  { "id": "start-project", "question": {...}, "answer": {"es": "Envíanos el brief de tu proyecto...", ...} },
  { "id": "small-budget", "question": {...}, "answer": {"es": "¡Sí! Cuéntanos de tu proyecto, el presupuesto...", ...} },
  { "id": "social-cause", "question": {...}, "answer": {"es": "¡Sí! Nos interesan mucho los proyectos con causa...", ...} },
  { "id": "internship", "question": {...}, "answer": {"es": "Escríbenos al correo hicasiopea@gmail.com...", ...} },
  { "id": "all-women", "question": {...}, "answer": {"es": "Sí, las 4 socias somos mujeres...", ...} },
  { "id": "mentorship", "question": {...}, "answer": {"es": "Nos encantaría saber cómo podemos ayudar...", ...} },
  { "id": "workshops", "question": {...}, "answer": {"es": "Sí, hemos dado talleres de animación...", ...} }
]
```

Exact question wording and full answer text will be transcribed verbatim from `faq.html` during Phase 6 (13 Q&A pairs found, slightly more than the ~10 estimated in docs/07). Each pair also has an associated image (see `faq.html`'s existing `images/faqs/N.webp` pattern) — images stay as static `<picture>` markup, unchanged, only the Q&A text moves to JSON. **Open question**: does moving FAQ into a content-loader-rendered list (vs. keeping the existing static HTML structure and just adding `data-i18n` to each question/answer in place, matching the credit-label approach in §B) actually reduce risk here? Given the "avoid unnecessary DOM manipulation" principle and that FAQ has a stable, unchanging list (not something added to over time the way projects are), recommend the same **inline dual-attribute / data-i18n-in-place** approach as FAQ credit labels rather than introducing `content/faq.json` + a loader — simpler, one less moving part, no runtime fetch for a page that's otherwise 100% static HTML today. Flagging this as a further simplification of §12's original file layout; will proceed this way unless you object.

## E. Emails and links (not translated — verified against 08/section rules)

`somos@casiopea.mx`, `ss@casiopea.mx`, `hicasiopea@gmail.com`, `somoscasiopea@gmail.com`, all social media URLs, all project client names, all people's names, all project titles — confirmed out of scope for translation ("Keep names and brands unchanged").
