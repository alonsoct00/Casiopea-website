#!/usr/bin/env python3
"""
Smart image path updater that finds moved images and updates all references.
"""

import re
from pathlib import Path

PROJECT_DIR = Path("/Users/alonsoct/Sites/Casiopea-website/projects")
IMAGES_DIR = PROJECT_DIR / "images"

def update_html_files():
    """Update all HTML files with new image paths."""
    print("🔗 Updating HTML image references...\n")
    
    html_files = list(PROJECT_DIR.glob("*.html"))
    updated_count = 0
    
    for html_file in html_files:
        content = html_file.read_text(encoding='utf-8')
        original_content = content
        
        # Find all image references and update them
        # Match patterns: Folder/filename, Folder/media/filename, media/filename, filename
        def replace_image_src(match):
            src_path = match.group(1)
            
            # Extract filename from path
            path_parts = Path(src_path)
            filename = path_parts.name
            
            # Search for this file in images directory
            for img_file in IMAGES_DIR.glob(f"*{filename}"):
                return f'data-src="images/{img_file.name}"'
            
            # If not found, return original
            return match.group(0)
        
        # Replace data-src patterns like data-src="Abuelitas-kitchen/AK_header.png"
        content = re.sub(
            r'data-src="([^"]*?/?[\w-]+\.(?:jpg|jpeg|png|gif|webp))"',
            replace_image_src,
            content,
            flags=re.IGNORECASE
        )
        
        # Replace src patterns (similar)
        def replace_image_src_direct(match):
            src_path = match.group(1)
            path_parts = Path(src_path)
            filename = path_parts.name
            
            for img_file in IMAGES_DIR.glob(f"*{filename}"):
                # For direct src (non-lazy), just return the path
                return f'src="images/{img_file.name}"'
            
            return match.group(0)
        
        content = re.sub(
            r'src="([^"]*?/?[\w-]+\.(?:jpg|jpeg|png|gif|webp))"(?!.*?type=)',
            replace_image_src_direct,
            content,
            flags=re.IGNORECASE
        )
        
        # Also update srcset and data-srcset patterns
        def replace_srcset(match):
            src_path = match.group(2)
            path_parts = Path(src_path)
            filename = path_parts.name
            
            for img_file in IMAGES_DIR.glob(f"*{filename}"):
                attr = match.group(1)
                return f'{attr}="images/{img_file.name}"'
            
            return match.group(0)
        
        content = re.sub(
            r'(data-srcset|srcset)="([^"]*?/?[\w-]+\.(?:jpg|jpeg|png|gif|webp))"',
            replace_srcset,
            content,
            flags=re.IGNORECASE
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
    update_html_files()

