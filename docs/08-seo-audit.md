# 08 — SEO Audit

## Current state: verified by direct grep across index.html, about-us.html, proyectos.html, contacto.html, faq.html, 404.html, and a sample project page

| Element | Present? | Detail |
|---|---|---|
| `<title>` | ✅ Yes, but weak | Present on every page but formulaic/short — e.g. `CASIOPEA`, `CASIOPEA - Nosotros`, `CASIOPEA - Contacto`, `CASIOPEA - Proyectos - Dos Camaleones`. Not keyword-rich, no unique per-project descriptive titles beyond the name. |
| `<meta name="description">` | ❌ Broken | Every single page has `<meta content='Description' name=''>` — the `name` attribute is **empty**, so this tag does nothing. It should be `name="description"` with real per-page copy. This is a sitewide bug, not just missing content. |
| `<meta name="keywords">` | ❌ Missing | Not present anywhere (low SEO value today, but harmless to add) |
| Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) | ❌ Missing | Zero OG tags found anywhere — social shares (Facebook, LinkedIn, Slack previews) currently show no rich preview |
| Twitter Card tags | ❌ Missing | None found |
| Canonical URL | ❌ Missing | No `<link rel="canonical">` anywhere |
| `hreflang` alternates | ❌ Missing | N/A today since there's only one language; **required** once English is added (Phase 10) so search engines don't treat the ES/EN variants as duplicate content — note the plan does not add URL variants (same URL serves both languages via JS), which means classic `hreflang` `<link>` tags won't apply cleanly since there's only one URL per page. This needs a decision: either accept no hreflang (single-URL JS-switched sites commonly skip it) or reconsider URL strategy. Flagging for Phase 10 planning, not a Phase 1 blocker.|
| JSON-LD structured data | ❌ Missing | No `Organization`, `LocalBusiness`, `CreativeWork`, or `BreadcrumbList` schema anywhere. Given this is a business portfolio site, an `Organization`/`LocalBusiness` schema on the home page and `CreativeWork`/`VideoObject` schema per project page would be high-value additions. |
| `<html lang>` | ❌ Missing | Every page's `<html>` tag has **no `lang` attribute at all** (confirmed via grep across all 6 root pages + sampled project page). This is both an SEO and accessibility issue (see docs/09) and is directly required by Phase 11 of the plan ("Verify `<html lang="es">`... switch dynamically to `<html lang="en">`"). |
| `sitemap.xml` | ❌ Missing | Not present in repo root |
| `robots.txt` | ❌ Missing | Not present in repo root |
| Image `alt` text | ⚠️ Inconsistent | Present on many images, empty (`alt=""`) or missing on others — full inventory belongs in `09-accessibility-audit.md` |
| Semantic HTML | ✅ Good | Proper use of `<header>`, `<footer>`, `<section>`, `<dl>/<dt>/<dd>`, `<figure>`, `<picture>` |
| Mobile viewport meta | ✅ Present | `width=device-width, initial-scale=1.0` on every page (though `user-scalable=no` on most pages — see accessibility note) |
| HTTPS-only resource loading | ✅ Good | Google Fonts, unpkg CDN all loaded over https |

## Priority fixes relevant to the i18n project scope

These aren't strictly "add English" work, but the plan explicitly calls for SEO internationalization (Phase 10) and the current state is broken enough that translating a broken tag doesn't help — recommend fixing the underlying `name=''` bug as part of Phase 6/10 rather than leaving it broken in two languages:

1. Fix `<meta content='Description' name=''>` → `<meta name="description" content="...">` on every page, with real per-page description text, sourced from `/locales/{es,en}.json` under an `seo.*` key so it swaps with the language.
2. Add `<html lang="es">` (default) with JS-driven `lang` attribute swap on language change — required by both SEO and accessibility, and explicitly named in Phase 11.
3. Add basic Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type=website`, `og:locale`) per page, bilingual, since social sharing previews currently show nothing useful.
4. Decide the `hreflang` question above before Phase 10 implementation.
5. `sitemap.xml` / `robots.txt` are good practice but are **not required by the i18n task** — flagging as a nice-to-have, not scheduling unless the user asks.

## Per-project SEO gap

Project pages have the weakest titles of all (`CASIOPEA - Proyectos - [Name]`) and zero unique descriptions — given each project is a distinct portfolio piece, this is a missed opportunity for organic search (e.g. someone searching "stop motion animation studio Mexico City"). Recommend each project's content JSON entry (Phase 5) carry a short SEO description field per language, used to populate that project page's `<title>`/`<meta description>`/OG tags at render/load time.
