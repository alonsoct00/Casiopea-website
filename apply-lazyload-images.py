#!/usr/bin/env python3
import os
import re
from pathlib import Path

PROJECT_DIR = Path('/Users/alonsoct/Sites/Casiopea-website')

html_files = [p for p in PROJECT_DIR.rglob('*.html') if '.DS_Store' not in str(p)]
html_files = [p for p in html_files if '.-olds-deleted' not in str(p)]

img_tag_pattern = re.compile(r'<img\s+([^>]*?)src="([^"]+)"([^>]*)>', re.IGNORECASE)

changed_files = []

for path in html_files:
    text = path.read_text(encoding='utf-8')
    original = text
    # Skip picture children by handling within picture blocks, using a simple state parser
    output = []
    idx = 0
    in_picture = False

    while idx < len(text):
        if not in_picture:
            pic_start = text.find('<picture', idx)
            if pic_start == -1:
                segment = text[idx:]
                def repl(m):
                    before = m.group(1)
                    src = m.group(2)
                    after = m.group(3)
                    if 'data-src=' in before + after or 'loading=' in before + after:
                        return m.group(0)
                    # do not touch image inside picture fallback if it already has srcset? but here we are outside picture
                    replacement = f'<img {before}data-src="{src}"{after}'
                    if 'loading=' not in before + after:
                        replacement = replacement[:-1] + ' loading="lazy">'
                    return replacement
                segment = img_tag_pattern.sub(repl, segment)
                output.append(segment)
                break
            else:
                segment = text[idx:pic_start]
                def repl(m):
                    before = m.group(1)
                    src = m.group(2)
                    after = m.group(3)
                    if 'data-src=' in before + after or 'loading=' in before + after:
                        return m.group(0)
                    replacement = f'<img {before}data-src="{src}"{after}'
                    if 'loading=' not in before + after:
                        replacement = replacement[:-1] + ' loading="lazy">'
                    return replacement
                segment = img_tag_pattern.sub(repl, segment)
                output.append(segment)
                # find picture close
                pic_end = text.find('</picture>', pic_start)
                if pic_end == -1:
                    output.append(text[pic_start:])
                    break
                else:
                    output.append(text[pic_start:pic_end+10])
                    idx = pic_end + 10
        else:
            pass
    new_text = ''.join(output)
    if new_text != original:
        path.write_text(new_text, encoding='utf-8')
        changed_files.append(path.relative_to(PROJECT_DIR).as_posix())

print('Updated files:', len(changed_files))
for p in changed_files:
    print(p)
