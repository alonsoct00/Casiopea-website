# 02 — Folder Structure

```
Casiopea-website/
├── index.html                    Home page (hero video)
├── about-us.html                 About / directors
├── proyectos.html                Filterable project gallery
├── contacto.html                 Contact form
├── faq.html                      FAQ page
├── 404.html                      Error page
├── README.md                     Existing project documentation (Spanish)
├── OPTIMIZATION-GUIDE.md         Existing performance playbook (Spanish)
├── .agent.md                     Existing AI-agent onboarding doc (Spanish)
├── favicon.ico / .png / .webp
│
├── docs/                         ← THIS AUDIT (new, Phase 1 output)
│
├── fonts/                        Font Awesome font files (svg/otf/ttf/woff/eot)
│
├── images/                       Root-level static images (~61 files)
│   ├── faqs/                     Images used only on faq.html
│   ├── tera-slider/              Images for the (likely unused) Tera Slider plugin
│   └── ...                       Logos, hero stills, about-us photos
│
├── videos/                       Hero reel videos (~7 files: desktop/mobile, mp4/mov, poster)
│
├── javascripts/                  ~13 JS files — see docs/03-components.md
│   ├── functions.js              Header/Footer Web Components + site behavior (ACTIVE)
│   ├── functions.jss             Unreferenced duplicate/older version (DEAD — see 11-technical-debt.md)
│   ├── jquery.min.js, bootstrap.min.js, isotope.pkgd.min.js, waypoints.min.js, ...
│   ├── tera-slider.js, tera-lightbox.js   Loaded everywhere, no confirmed usage in markup
│   └── validation.js             Contact form client-side validation
│
├── stylesheets/                  ~8 CSS/LESS files
│   ├── bootstrap.min.css, font-awesome.min.css   Vendor
│   ├── style.min.css             Used by the 6 ROOT pages
│   ├── style.css                 Used by ALL 22 project pages + faq.html (unminified twin of style.min.css)
│   ├── the-casiopea-styles.css   Custom site styles, used everywhere
│   ├── the-casiopea-styles.less  LESS source for the above
│   ├── old-styles.css / .less    Unreferenced by any HTML (DEAD)
│   └── tera-lightbox.css, tera-slider.css   Vendor plugin styles
│
├── php/
│   └── email.php                 Contact form → email handler (only backend logic)
│
├── projects/
│   ├── _index.html               Auto-generated project index (see generate-project-index.py)
│   ├── abuelitas-kitchen.html    ┐
│   ├── ambulante.html            │
│   ├── animasivo.html            │
│   ├── ben-and-frank.html        │
│   ├── birdsong.html             │
│   ├── campanias.html            │  22 individual project pages,
│   ├── centavrvs.html            │  all following one shared template
│   ├── cutout-fest.html          │  (see docs/04-pages.md)
│   ├── dos-camaleones.html       │
│   ├── franz-mayer.html          │
│   ├── hise.html                 │
│   ├── kidoo.html                │
│   ├── la-catrina.html           │
│   ├── macmillan.html            │
│   ├── no-se-aceptan-devoluciones.html
│   ├── now-within.html           │
│   ├── poliangular.html          │
│   ├── smmx.html                 │
│   ├── song-last-lacandon.html   │
│   ├── the-impossible-dream.html │
│   ├── the-river-kon.html        │
│   └── video-explicativo.html    ┘
│   │
│   ├── images/home-projects/     Thumbnails used by proyectos.html grid tiles
│   │
│   ├── .-olds-deleted/           10 retired project pages, filenames prefixed "._" — not
│   │                             linked anywhere. Leave alone (do not delete without asking).
│   │
│   └── [26 media folders]        e.g. 1-Dos_camaleones/media/, 3-Birdsong/media/,
│                                  Song_lacandon/, Franz-Mayer/, etc.
│                                  Two naming conventions coexist:
│                                    "[N]-PascalCase_With_Underscores/"  (older/legacy projects)
│                                    "PascalCase-With-Hyphens/"          (newer projects)
│                                  Each holds media/ (+ often media/portada/ or media/Portada/)
│                                  containing .mp4, .mov, .jpg/.webp/.png, and *.lottie.json
│
├── apply-lazyload-images.py      Dev utility: injects data-src/loading=lazy into <img>
├── fix-image-paths.py            Dev utility: path corrections
├── fix-picture-elements.py       Dev utility: <picture> element fixes
├── fix-portada-paths.py          Dev utility: portada/ path corrections
├── optimize-html.py              Dev utility: HTML minification
├── reorganize-images.py          Dev utility: asset reorganization
├── generate-project-index.py     Generates projects/_index.html
└── optimize-images.sh            Shell script wrapping cwebp/ffmpeg conversions
```

## Notes on naming inconsistency

Project media folders use two different conventions (legacy numbered/underscored vs. newer hyphenated PascalCase). This is pre-existing technical debt (see `11-technical-debt.md`) and is **out of scope to fix** as part of the i18n project — paths must not be touched, since the instructions require zero visual/behavioral change and minimal-risk edits. The content JSON that Phase 5 introduces should record whatever path already exists per project rather than normalizing folder names.
