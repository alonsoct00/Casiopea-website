# SEO Content (Phase 3)

Full gap analysis is in `docs/08-seo-audit.md`. This doc lists what will be authored and where, per the approved architecture — actual copy (title/description text) is written directly into `locales/{es,en}.json` under `seo.*` during Phase 6/10 implementation, not duplicated here first, for the same reason given in `content-inventory.md`: avoiding maintaining the same text in two places.

## Pages needing new/fixed SEO metadata

| Page | `seo.<key>` | Fixes |
|---|---|---|
| `index.html` | `seo.home` | Replace broken `name=''` tag; add title, description, OG (title/description/image/type/locale) |
| `about-us.html` | `seo.about` | Same |
| `proyectos.html` | `seo.projects` | Same |
| `contacto.html` | `seo.contact` | Same |
| `faq.html` | `seo.faq` | Same |
| `404.html` | `seo.errors404` | Same (non-indexable page, but title/lang still fixed) |
| Each of 22 project pages | `seo.project.<slug>` | Title includes project name (proper noun, unchanged) + a short bilingual description; OG image = project's existing poster/hero still, no new asset needed |

## Structural fixes (apply once, benefit every page)

- `<html lang="es">` default, swapped to `en` by `i18n.js` on language change (see `docs/12-architecture-design.md` §5) — same mechanism already designed for FOUC prevention, no separate work.
- `<meta name="description">` bug fix (currently `name=''`) — corrected as part of adding the `data-i18n` binding to this tag, not a separate pass.
- Open Graph tags (`og:title`, `og:description`, `og:type`, `og:locale`, `og:image`) added to the shared `<head>` boilerplate — added once and copied across all 29 pages the same way the existing 4-stylesheet block already is (matches current copy-paste-per-page convention, no new mechanism introduced).
- `hreflang` / canonical / JSON-LD / sitemap.xml / robots.txt: per `docs/08`, these are either not applicable to a single-URL JS-switched site (`hreflang`) or genuinely out of scope for an i18n task (sitemap/robots/JSON-LD are general SEO hygiene, not translation work) — not part of this implementation unless you ask for them separately.

No further Phase 3 output is needed beyond this scoping — the actual bilingual copy gets written once, directly into `locales/es.json` and `locales/en.json`, during implementation.
