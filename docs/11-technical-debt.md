# 11 — Technical Debt Inventory

Catalogued during the read-only audit. None of these were fixed — this is a list for the user to triage, not a to-do list this project will silently execute. Items are flagged **relevant** if they intersect the i18n work and should probably be addressed alongside it, or **unrelated** if they're pre-existing and out of scope unless the user asks.

## Dead / orphaned files

| File | Status | Relevant? |
|---|---|---|
| `javascripts/functions.jss` | Not referenced by any HTML page (confirmed via sitewide grep). Appears to be an older or alternate version of `functions.js` — first ~15 lines are near-identical (same `Header` class). | Unrelated — do not touch without asking; could be a backup the user wants kept. |
| `stylesheets/old-styles.css` / `old-styles.less` | Not referenced by any HTML page (confirmed via sitewide grep). | Unrelated. |
| `projects/.-olds-deleted/*.html` (10 files, `._`-prefixed) | Not linked from any live page; appears to be an intentional "retired projects" holding area. | Unrelated — leave in place. |

## Bugs found

| Bug | Location | Detail |
|---|---|---|
| Broken meta description tag | Every page's `<head>` | `<meta content='Description' name=''>` — empty `name` attribute means this tag has zero effect. See `08-seo-audit.md`. |
| Missing `.msg` element | `javascripts/validation.js` + `contacto.html` | Validation JS calls `$('.msg').fadeIn()`/`.fadeOut()` on error, but no element with class `msg` exists anywhere in `contacto.html`'s markup — error state is silently swallowed, user gets no visible feedback on validation failure. |
| Loose equality / weak email check | `javascripts/validation.js` | Email validation is `email.indexOf('@') == '-1'` (string comparison against `'-1'` instead of number `-1`) — works by JS type coercion but is fragile and not a real email format check. |
| Invalid `type="text"` on `<textarea>` | `contacto.html:46` | `<textarea>` doesn't support a `type` attribute; harmless (browsers ignore it) but incorrect markup. |
| No `<html lang>` anywhere | All 29 HTML pages | See `08-seo-audit.md` / `09-accessibility-audit.md` — **directly blocks Phase 11**, should be fixed as part of this project. |

## Inconsistencies

| Item | Detail |
|---|---|
| `style.css` vs `style.min.css` | Root pages use the minified version; all project pages + faq.html use the unminified version. Looks unintentional (see `10-performance-audit.md`). |
| Project media folder naming | Two conventions coexist: `[N]-PascalCase_With_Underscores/` (legacy) vs `PascalCase-With-Hyphens/` (newer). See `02-folder-structure.md`. Do not normalize as part of this project — high risk of breaking asset paths for little i18n benefit. |
| 404.html is in English, everything else is in Spanish | See `04-pages.md`. Needs a decision from the user on how to treat it once translation work starts. |
| Footer copyright line is in English (`&copy; 2026 Casiopea. All Rights Reserved.`) while surrounding site is Spanish | Same category of inconsistency as 404.html — worth deciding on a single default-language policy for these two spots before Phase 8 translation begins. |
| `tera-slider.js`/`tera-lightbox.js`/`tera-slider.css`/`tera-lightbox.css` loaded on every page with no confirmed markup usage | Possibly vestigial from an earlier template; not costing correctness today, just extra bytes. Flag only — do not remove without the user's confirmation, since "no markup usage found" during a code read isn't proof of zero runtime usage (e.g. could be invoked dynamically). |
| IE9 fallback scripts (`html5shiv.js`, `respond.min.js`) loaded via conditional comments on every page | Dead weight for 2026 traffic, but conditional comments mean zero cost for modern browsers (IE conditional comments are simply ignored/stripped by all non-IE browsers) — essentially free to leave, no urgency to remove. |
| "Talleres" and "Visuales" filter categories exist in the header submenu but match zero current project tiles | Not a bug — likely just categories awaiting future projects. Preserve as-is per `06-navigation.md`. |
| `projects/*/` "Otros Proyectos" grid only ever renders one static "Regresar" link | Looks like an unfinished related-projects feature (`functions.js:227`). Not broken, just incomplete. Out of scope to "finish" as part of i18n — just needs its one string (`Regresar`) translated like everything else. |

## Recommended handling for this project

- **Must fix as part of i18n work** (both because they're required by the stated phases and because translating broken behavior twice is wasted effort): missing `<html lang>`, broken `<meta name="description">`.
- **Should raise with the user before Phase 8 (translation)**: 404.html and footer copyright already being English — decide the target bilingual behavior for these two spots specifically.
- **Leave alone, mention in the final migration report**: dead files, folder naming inconsistency, unused vendor plugins, IE9 fallbacks, the unfinished related-projects feature. None of these block or are blocked by i18n work; fixing them would be unrequested scope creep into a change that's supposed to preserve "100% of current functionality, appearance and performance."
