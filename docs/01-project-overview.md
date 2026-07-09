# 01 — Project Overview

## What this is

CASIOPEA is the production marketing/portfolio website for a Mexico City animation studio (directors: Andrea Mondragón, Sandra Medina). It is a **static site**: no build step, no framework, no server-side rendering beyond a single PHP form handler. Pages are hand-authored HTML files that share two Web Components (header/footer) and a common stylesheet/script bundle.

The site is 100% Spanish today. This audit is Phase 1 of a project to add English as a second language without changing markup, visuals, animations, or behavior.

## Stack (confirmed by inspection)

| Layer | Technology | Notes |
|---|---|---|
| Markup | HTML5, hand-written | No templating engine, no includes |
| Styling | CSS3 + Bootstrap 3.x | Custom styles in `the-casiopea-styles.css`; LESS sources present but compiled output is what's linked |
| Interactivity | jQuery 1.x + vanilla JS | `functions.js` defines Web Components and site behavior |
| Filtering | Isotope.js | Used on `proyectos.html` only |
| Animation | Lottie (via `lottie-player` web component, CDN) | Per-project JSON animation files |
| Scroll effects | Waypoints.js | Fade-in / reveal on scroll |
| Backend | PHP 5.6+ (`php/email.php`) | Only server logic: contact form → email |
| Hosting | Hostinger (per OPTIMIZATION-GUIDE.md) | Apache-style static hosting with PHP |

There is no package.json, no npm, no bundler, no CI. Deployment is manual file upload.

## Site scope (verified counts)

- **6 root pages**: `index.html`, `about-us.html`, `proyectos.html`, `contacto.html`, `faq.html`, `404.html`
- **23 project pages** in `/projects/*.html` (one is `_index.html`, an auto-generated index — see `generate-project-index.py`)
- **~304 image assets** and **~100 video assets** under `/projects/**/media/`
- **61 images** in root `/images/`, **7 videos** in root `/videos/` (hero reels)
- **10 orphaned/deleted project pages** preserved in `projects/.-olds-deleted/` (prefixed `._`, not linked from anywhere — safe to ignore, do not delete without asking)

## Key architectural fact for i18n

The **only** shared/reusable markup in the whole site is the `<main-header>` and `<main-footer>` Web Components defined in `javascripts/functions.js`. Everything else — page body content, project credits, meta tags, form labels — is duplicated per-file with no include mechanism. This has two consequences for the i18n project:

1. Adding a language switcher is easy (one place: the Header component).
2. Translating body content is **not** a find-and-replace in one file — it requires touching all 29 HTML pages individually, or introducing a content-loader that renders text from JSON (which is what Phases 5–7 of the plan propose).

## Documents in this audit

| Doc | Contents |
|---|---|
| `02-folder-structure.md` | Full directory tree with purpose of each folder |
| `03-components.md` | Header/Footer Web Components, third-party plugins in use |
| `04-pages.md` | Per-page anatomy for all 6 root pages + the project page template |
| `05-assets.md` | Images, videos, fonts, Lottie JSON inventory |
| `06-navigation.md` | Nav structure, filter categories, internal linking |
| `07-content-map.md` | High-level map of where translatable text lives (detailed extraction is Phase 2) |
| `08-seo-audit.md` | Meta tag / structured data gaps |
| `09-accessibility-audit.md` | WCAG-relevant findings |
| `10-performance-audit.md` | Lazy-loading, image formats, minification state |
| `11-technical-debt.md` | Dead files, bugs, inconsistencies found during the audit |

No code was modified during this phase.
