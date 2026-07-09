# 05 — Asset Inventory

## Images

| Location | Count | Notes |
|---|---|---|
| `/images/` (root) | ~61 | Logos, hero stills, about-us photos, `images/faqs/*`, `images/tera-slider/*` |
| `/projects/**/media/**` | ~304 | Per-project gallery images, mostly paired `.jpg`/`.png` + `.webp` |
| `/projects/images/home-projects/` | subset of above | Thumbnails used as tile backgrounds on `proyectos.html` |

Formats present: `.webp` (140 files sitewide), `.jpg` (81), `.png` (65), `.gif` (49, mostly small/animated logo variants), `.jpeg` (34). The `.webp`+fallback pairing pattern (`<picture>` with `<source type="image/webp">` + `<img>` fallback) is applied inconsistently — some images only exist as `.webp` with no fallback (e.g. `dos-camaleones.html:131-132` uses the same `.webp` file for both `data-srcset` and `data-src`, meaning there's no actual raster fallback for that particular image).

## Videos

| Location | Count | Notes |
|---|---|---|
| `/videos/` (root) | 7 | Hero reels: desktop + mobile, `.mp4` + `.mov` pairs, plus 1 poster image |
| `/projects/**/media/**` | ~100 | `.mp4` (87 sitewide) + `.mov` (17) pairs per gallery clip/breakdown/portada |

Every video that has a `.mov` sibling always lists `.mp4` first in markup, so `.mov` is a fallback for browsers that don't support `.mp4` (essentially none today) — this is disproportionate: `.mov` files are large and rarely needed. Out of scope to change here, but noted in `10-performance-audit.md`.

## Lottie animation data

9 `*.lottie.json` files found, all inside `/projects/**/media/`, named after their source clip (e.g. `8-Birdsong.mp4.lottie.json`). These are referenced by local path in some project pages, but several project pages instead pull Lottie animations directly from `lottiefiles.com`'s CDN (`assets10.lottiefiles.com/packages/...`) rather than the local JSON — inconsistent sourcing, not an i18n concern but worth flagging as debt.

## Fonts

`/fonts/` — Font Awesome 4.x icon font only, 5 formats (`.svg`, `.otf`, `.ttf`, `.woff`, `.eot`) for cross-browser coverage. No custom/brand webfonts are self-hosted; Roboto and Inconsolata are pulled from Google Fonts CDN.

## Media referenced by relative path, not by ID

There is no central asset manifest. Every image/video path is written by hand in the HTML. This matters for Phase 5/7 (content JSON + loader): when project data moves into `content/projects.json`, each project's media paths must be copied verbatim from the existing HTML — there is no naming convention reliable enough to derive paths programmatically (see the two competing project-folder naming conventions noted in `02-folder-structure.md`).
