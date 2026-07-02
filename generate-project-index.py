#!/usr/bin/env python3
"""Generate a project index HTML page for the Casiopea website."""

from pathlib import Path
import re

PROJECT_DIR = Path("projects")
OUTPUT_FILE = PROJECT_DIR / "index.html"
HTML_GLOB = "*.html"

TEMPLATE = """<!DOCTYPE html>
<html>

<head>
    <title>CASIOPEA - Índice de Proyectos</title>
    <meta charset='utf-8'>
    <meta content='Catalogo de proyectos' name='description'>
    <meta content='width=device-width, initial-scale=1' name='viewport'>
    <link href='../stylesheets/bootstrap.min.css' rel='stylesheet' type='text/css' />
    <link href='../stylesheets/font-awesome.min.css' rel='stylesheet' type='text/css' />
    <link href='../stylesheets/style.css' rel='stylesheet' type='text/css' />
    <link href='../stylesheets/the-casiopea-styles.css' rel='stylesheet' type='text/css' />
    <!--[if lt IE 9]>
    <script src='../javascripts/html5shiv.js' type='text/javascript'></script>
    <script src='../javascripts/respond.min.js' type='text/javascript'></script>
    <![endif]-->
</head>

<body id="casiopea-project" style="background-color: #fff;">
    <div class="Noise"></div>
    <div class='container-fluid' id="casiopea-wsite">
        <header data-spy='affix'>
            <main-header></main-header>
        </header>
        <section class='jumbotron casiopea-section'>
            <div class='text-center'>
                <h1 class="intro-project-title">Índice de Proyectos</h1>
                <p class='lead'>Revisa los proyectos visualmente sin escribir la URL directamente.</p>
                <p><small>Esta página se genera desde <code>generate-project-index.py</code>.</small></p>
            </div>
        </section>
        <section class='wide'>
            <div class='block'>
                <div class='row'>
                    <div class='col-md-10 col-md-offset-1'>
                        <div class='list-group'>
{items}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <footer>
            <main-footer></main-footer>
        </footer>
    </div>
    <script src="../javascripts/jquery.min.js" type="text/javascript"></script>
    <script src="../javascripts/jquery.easing.1.3.js" type="text/javascript"></script>
    <script src="../javascripts/bootstrap.min.js" type="text/javascript"></script>
</body>

</html>
"""

TITLE_REGEX = re.compile(r"<title>(.*?)</title>", re.IGNORECASE)


def get_page_title(page_path: Path) -> str:
    content = page_path.read_text(encoding='utf-8', errors='ignore')
    match = TITLE_REGEX.search(content)
    if match:
        title = match.group(1).strip()
        return title if title else page_path.stem
    return page_path.stem


def build_index() -> str:
    pages = sorted([p for p in PROJECT_DIR.glob(HTML_GLOB) if p.is_file() and p.name != OUTPUT_FILE.name])
    items = []
    for page in pages:
        title = get_page_title(page)
        relative = page.name
        items.append(f"                            <a href='./{relative}' class='list-group-item list-group-item-action'>\n                                <h4 class='list-group-item-heading'>{title}</h4>\n                                <p class='list-group-item-text'>{relative}</p>\n                            </a>")
    if not items:
        items = ["                            <div class='alert alert-warning'>No se encontraron proyectos HTML en la carpeta projects/.</div>"]
    return TEMPLATE.format(items='\n'.join(items))


def write_index():
    OUTPUT_FILE.write_text(build_index(), encoding='utf-8')
    print(f'Generated {OUTPUT_FILE}')


if __name__ == '__main__':
    write_index()
