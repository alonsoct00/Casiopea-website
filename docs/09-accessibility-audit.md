# 09 — Accessibility Audit

Spot-checked against index.html, about-us.html, proyectos.html, contacto.html, faq.html, 404.html, and dos-camaleones.html (project template).

## Findings

| Area | Status | Detail |
|---|---|---|
| `<html lang>` | ❌ Missing everywhere | No page declares a language. Screen readers default to the OS/browser language, which will mispronounce Spanish content for non-Spanish default users and vice versa. Directly blocks Phase 11's requirement to toggle `lang="es"`/`lang="en"`. |
| `alt` attributes on images | ⚠️ ~50% missing/empty | Sampled 29 `<img>` tags across 6 pages/1 project page — 14 had empty (`alt=""`) or absent `alt`. Decorative images (background pattern-style shots) may be intentionally empty-alt, but several content images (project stills) had no alt text at all, which is a real gap, e.g. `dos-camaleones.html:179` (`alt="" title=""` on a project still that isn't decorative). |
| Viewport zoom disabled | ⚠️ `user-scalable=no` | Present on index.html, about-us.html, proyectos.html, contacto.html, 404.html (faq.html not checked but likely same pattern). This blocks pinch-zoom for low-vision users — a WCAG 1.4.4 (Resize Text) failure. Pre-existing, not introduced by this project, but worth flagging since accessibility is an explicit goal (Phase 11) — recommend removing `user-scalable=no` and `maximum-scale=1.0` as a low-risk fix, though this is technically outside "i18n" scope and should be confirmed with the user before touching. |
| Footer social icons | ❌ No accessible name | `<a class='icon fa fa-vimeo' href='...'></a>` etc. — icon-font links with no text content and no `aria-label`. Screen readers will announce these as bare/unlabeled links. Should get `aria-label="Vimeo"` etc. (translatable) when the footer component is touched for i18n anyway. |
| Bootstrap `collapse` (about-us.html team bios, currently disabled) | ✅ Has ARIA | `aria-expanded`, `aria-controls` present on the (commented-out) show-more buttons — good pattern, just currently unused. |
| Semantic structure | ✅ Good | `<dl>/<dt>/<dd>` for project credits, `<figure>`, proper heading nesting observed in sampled pages. |
| Form labels (contacto.html) | ⚠️ Placeholder-only | All 5 form fields use `placeholder` text instead of associated `<label>` elements. Placeholder-as-label is a common WCAG issue (placeholder text disappears on input, and isn't reliably exposed to all assistive tech the same way a `<label>` is). Pre-existing issue; translating the placeholder text doesn't fix the underlying gap but shouldn't make it worse. Flagging for user decision — real `<label>` elements could be added (visually hidden via existing CSS conventions if the visual design must stay identical). |
| Keyboard nav / focus | Not deeply tested (would require a live browser pass) | The hamburger menu trigger and Isotope filter buttons are `<div>`/`<button>`-based; a full keyboard-trap and focus-order check should happen in Phase 11 QA. |
| Color contrast | Not audited | Would need visual/tool-based check (e.g. axe DevTools), out of scope for a static code read. |

## Direct relevance to Phase 9 (language switcher) and Phase 11 (accessibility)

- The language switcher itself must be a real, keyboard-focusable, `aria`-labeled control (e.g. `<button aria-pressed>` or `<a role="button">` pair) — not a bare clickable `<span>`, matching the existing site's general (if imperfect) use of semantic elements.
- `<html lang>` must update synchronously with the visible text swap to avoid a state where displayed language and declared `lang` attribute disagree (would itself be a regression, not just leaving it broken).
- Because the site currently has no aria-live region anywhere, the language switch (which changes text without a page reload) should ideally announce the change to screen reader users — worth a lightweight `aria-live="polite"` region as part of Phase 9, though this goes slightly beyond "preserve current behavior" since there was no live-region system before. Recommend discussing with the user whether this refinement is in scope or should be deferred.

## Non-blocking, pre-existing issues (do not fix as part of i18n work unless asked)

- `user-scalable=no` / zoom-disabled viewport
- Placeholder-only form labels
- Inconsistent `alt` text coverage on images unrelated to project content (would require design/content-owner input per image, not a code fix)

These are called out because Phase 11 says "no accessibility regressions" — meeting that bar doesn't require fixing pre-existing issues, only not introducing new ones. Fixing them would be a nice bonus but is additional scope beyond what was asked.
