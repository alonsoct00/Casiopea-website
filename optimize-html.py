#!/usr/bin/env python3
"""
HTML Image Optimization Script
Converts JPG/PNG img references to picture elements with WebP fallback
"""

import re
from pathlib import Path

# Configuration
PROJECT_DIR = Path("/Users/alonsoct/Sites/Casiopea-website")
HTML_FILES = [p for p in PROJECT_DIR.rglob("*.html") if not any(part.startswith('.') for part in p.parts)]
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png'}

IMG_TAG_REGEX = re.compile(r'<img\b([^>]*)>', re.IGNORECASE)
PICTURE_BLOCK_REGEX = re.compile(r'<picture\b[^>]*>.*?</picture>', re.IGNORECASE | re.DOTALL)
ATTRIBUTE_REGEX = re.compile(r'([\w:-]+)(?:\s*=\s*("[^"]*"|\'[^\']*\'))?')


def parse_attributes(attr_string):
    attrs = {}
    for name, value in ATTRIBUTE_REGEX.findall(attr_string):
        if value:
            attrs[name.lower()] = value[1:-1]
        else:
            attrs[name.lower()] = None
    return attrs


def format_attributes(attrs):
    parts = []
    for key, value in attrs.items():
        if value is None:
            parts.append(key)
        else:
            escaped = value.replace('"', '&quot;')
            parts.append(f'{key}="{escaped}"')
    return ' '.join(parts)


def should_convert_to_webp(src):
    return Path(src).suffix.lower() in IMAGE_EXTENSIONS


def build_picture_element(attrs, file_dir):
    src_attr = 'data-src' if 'data-src' in attrs else 'src' if 'src' in attrs else None
    if not src_attr:
        return None

    src_value = attrs[src_attr]
    if not src_value or src_value.lower().endswith('.gif'):
        return None
    if not should_convert_to_webp(src_value):
        return None

    webp_path = (file_dir / src_value).with_suffix('.webp')
    if not webp_path.exists():
        return None

    picture_attrs = {}
    source_attrs = {}
    if src_attr == 'data-src':
        source_attrs['data-srcset'] = webp_path.as_posix()
        picture_attrs['data-src'] = src_value
    else:
        source_attrs['srcset'] = webp_path.as_posix()
        picture_attrs['src'] = src_value

    # Preserve all attrs except src/data-src and srcset/data-srcset
    image_attrs = {}
    for key, value in attrs.items():
        if key in {'src', 'data-src', 'srcset', 'data-srcset'}:
            continue
        image_attrs[key] = value

    if src_attr == 'src' and 'loading' not in image_attrs:
        image_attrs['loading'] = 'lazy'

    source_attr_str = ' '.join(f'{k}="{v}"' for k, v in source_attrs.items())
    image_attr_str = format_attributes(image_attrs)

    picture = '<picture>\n                    '
    picture += f'<source {source_attr_str} type="image/webp">\n                    '
    picture += f'<img {image_attr_str}'
    if picture.endswith(' '):
        picture = picture.rstrip(' ')
    picture += '>'
    picture += '\n                </picture>'

    return picture


def convert_img_tags_outside_pictures(content, file_dir):
    segments = []
    last_end = 0
    for match in PICTURE_BLOCK_REGEX.finditer(content):
        segments.append(content[last_end:match.start()])
        segments.append(match.group(0))
        last_end = match.end()
    segments.append(content[last_end:])

    processed = []
    for segment in segments:
        if segment.startswith('<picture'):
            processed.append(segment)
        else:
            processed.append(IMG_TAG_REGEX.sub(lambda m: replace_img_tag(m.group(1), file_dir), segment))
    return ''.join(processed)


def replace_img_tag(attr_string, file_dir):
    attrs = parse_attributes(attr_string)
    picture = build_picture_element(attrs, file_dir)
    if picture:
        return picture

    # Rebuild original tag preserving attribute order approximation
    return '<img ' + format_attributes(attrs) + '>'


def convert_img_tags_in_file(filepath):
    content = filepath.read_text(encoding='utf-8')
    new_content = convert_img_tags_outside_pictures(content, filepath.parent)
    if new_content != content:
        filepath.write_text(new_content, encoding='utf-8')
        return True
    return False


def optimize_all_html_files():
    updated_count = 0
    skipped_count = 0

    print('🖼️  Optimizing HTML image references to WebP...\n')
    for html_file in sorted(HTML_FILES):
        try:
            if convert_img_tags_in_file(html_file):
                print(f'✅ Updated: {html_file.relative_to(PROJECT_DIR)}')
                updated_count += 1
            else:
                print(f'⏭️  No changes: {html_file.relative_to(PROJECT_DIR)}')
                skipped_count += 1
        except Exception as e:
            print(f'⚠️  Error in {html_file.relative_to(PROJECT_DIR)}: {e}')

    print('\n' + '=' * 50)
    print('Summary:')
    print(f'  Updated: {updated_count} files')
    print(f'  Skipped: {skipped_count} files')
    print('=' * 50)


if __name__ == '__main__':
    optimize_all_html_files()
