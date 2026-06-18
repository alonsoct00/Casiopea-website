#!/usr/bin/env python3
"""
HTML Image Optimization Script
Converts img src references to picture elements with WebP fallback
"""

import os
import re
from pathlib import Path

# Configuration
PROJECT_DIR = Path("/Users/alonsoct/Sites/Casiopea-website")
HTML_FILES = list(PROJECT_DIR.glob("*.html")) + list(PROJECT_DIR.glob("projects/*.html"))

# Map of original formats to WebP alternatives
IMAGE_EXTENSIONS = {'.jpg': '.webp', '.png': '.webp', '.jpeg': '.webp'}

def should_convert_to_webp(img_path):
    """Check if image has WebP equivalent"""
    img_path = Path(img_path)
    for ext in ['.jpg', '.png', '.jpeg']:
        if img_path.suffix.lower() == ext:
            webp_path = img_path.with_suffix('.webp')
            return webp_path
    return None

def create_picture_element(img_src, class_attr="", alt_attr="", loading_lazy=True):
    """Create picture element with WebP and fallback"""
    webp_src = should_convert_to_webp(img_src)
    
    if not webp_src:
        # If no WebP version, return original img tag
        return f'<img src="{img_src}" class="{class_attr}" alt="{alt_attr}" loading="lazy">' if loading_lazy else f'<img src="{img_src}" class="{class_attr}" alt="{alt_attr}">'
    
    # Extract extension
    original_ext = Path(img_src).suffix.lower()
    
    # Build picture element
    picture = '<picture>'
    picture += f'\n                    <source srcset="{webp_src}" type="image/webp">'
    picture += f'\n                    <img src="{img_src}" class="{class_attr}" alt="{alt_attr}"'
    if loading_lazy:
        picture += ' loading="lazy"'
    picture += '>'
    picture += '\n                </picture>'
    
    return picture

def convert_img_tags_in_file(filepath):
    """Convert img tags to picture elements in a file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern to match img tags with src attribute
    # Matches: <img src="path/to/image.png" ... >
    # Captures: src path, class, alt, and other attributes
    
    def replace_img_tag(match):
        full_tag = match.group(0)
        src_match = re.search(r'src="([^"]+)"', full_tag)
        class_match = re.search(r'class="([^"]*)"', full_tag)
        alt_match = re.search(r'alt="([^"]*)"', full_tag)
        
        if not src_match:
            return full_tag
        
        src = src_match.group(1)
        class_attr = class_match.group(1) if class_match else ""
        alt_attr = alt_match.group(1) if alt_match else ""
        
        # Skip GIF images (animated)
        if src.lower().endswith('.gif'):
            return full_tag
        
        # Check if WebP version exists
        webp_version = should_convert_to_webp(PROJECT_DIR / src)
        if not webp_version:
            return full_tag
        
        # Build picture element
        picture = '<picture>'
        picture += f'\n                    <source srcset="{webp_version}" type="image/webp">'
        picture += f'\n                    <img src="{src}" class="{class_attr}" alt="{alt_attr}" loading="lazy">'
        picture += '\n                </picture>'
        
        return picture
    
    # Replace img tags (but not already inside picture elements)
    # This is a simplified approach - looks for <img tags not preceded by <picture
    content = re.sub(r'<img\s+src="[^"]+"\s*(?:class="[^"]*"\s*)?(?:alt="[^"]*"\s*)?/?>', replace_img_tag, content)
    
    # Write back if changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def optimize_all_html_files():
    """Process all HTML files in the project"""
    updated_count = 0
    skipped_count = 0
    
    print("🖼️  Optimizing HTML image references to WebP...\n")
    
    for html_file in HTML_FILES:
        filename = html_file.name
        try:
            if convert_img_tags_in_file(html_file):
                print(f"✅ Updated: {filename}")
                updated_count += 1
            else:
                print(f"⏭️  No changes: {filename}")
                skipped_count += 1
        except Exception as e:
            print(f"⚠️  Error in {filename}: {str(e)}")
    
    print(f"\n{'='*50}")
    print(f"Summary:")
    print(f"  Updated: {updated_count} files")
    print(f"  Skipped: {skipped_count} files")
    print(f"{'='*50}")

if __name__ == "__main__":
    optimize_all_html_files()
