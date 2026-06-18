#!/usr/bin/env python3
"""
Fix picture elements by adding data-src to img tags based on source data-srcset.
"""

import re
from pathlib import Path

PROJECT_DIR = Path("/Users/alonsoct/Sites/Casiopea-website/projects")

def fix_picture_elements():
    """Add data-src to img tags inside picture elements."""
    print("🖼️  Fixing picture elements...\n")
    
    html_files = list(PROJECT_DIR.glob("*.html"))
    updated_count = 0
    
    for html_file in html_files:
        content = html_file.read_text(encoding='utf-8')
        original_content = content
        
        # Find all picture elements and fix them
        def fix_picture(match):
            picture_html = match.group(0)
            
            # Extract data-srcset from source
            srcset_match = re.search(r'data-srcset="([^"]+\.webp)"', picture_html)
            if not srcset_match:
                return picture_html
            
            data_srcset = srcset_match.group(1)
            # Convert webp path to fallback format (jpg or png)
            fallback_src = data_srcset.replace('.webp', '.png')
            
            # Add data-src to img tag if it doesn't have it
            if 'data-src=' not in picture_html and 'src=' not in picture_html:
                picture_html = re.sub(
                    r'(<img\s+)(?=[^>]*(?:alt|title|class))',
                    rf'\1data-src="{fallback_src}" ',
                    picture_html
                )
            
            return picture_html
        
        # Replace all picture elements
        content = re.sub(
            r'<picture\b[^>]*>.*?</picture>',
            fix_picture,
            content,
            flags=re.IGNORECASE | re.DOTALL
        )
        
        if content != original_content:
            html_file.write_text(content, encoding='utf-8')
            print(f"✅ Updated: {html_file.name}")
            updated_count += 1
        else:
            print(f"⏭️  No changes: {html_file.name}")
    
    print(f"\n{'='*50}")
    print(f"Summary: {updated_count} files updated")
    print(f"{'='*50}")

if __name__ == "__main__":
    fix_picture_elements()
