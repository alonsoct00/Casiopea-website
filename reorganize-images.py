#!/usr/bin/env python3
"""
Reorganize project images to a central location and update HTML references.
"""

import shutil
import re
from pathlib import Path

PROJECT_DIR = Path("/Users/alonsoct/Sites/Casiopea-website/projects")
IMAGES_DIR = PROJECT_DIR / "images"
IMAGES_DIR.mkdir(exist_ok=True)

# Map of old paths to new names (for updating HTML)
path_mapping = {}

def sanitize_filename(name):
    """Remove problematic characters from filename."""
    return re.sub(r'[^\w\-.]', '', name)

def move_images():
    """Move all images to projects/images/ with unique names."""
    print("📦 Moving images to projects/images/...\n")
    
    # Find all image folders
    for folder in PROJECT_DIR.glob("*/"):
        if folder.name == "images" or folder.name.startswith("."):
            continue
        
        # Check for media subfolder
        media_dir = folder / "media"
        if media_dir.exists():
            source_dir = media_dir
            prefix = f"{folder.name}_"
        else:
            source_dir = folder
            prefix = f"{folder.name}_"
        
        # Move images from source_dir
        for img_file in source_dir.glob("*"):
            if img_file.is_file() and img_file.suffix.lower() in {'.jpg', '.jpeg', '.png', '.gif', '.webp'}:
                new_name = f"{prefix}{img_file.name}"
                dest_path = IMAGES_DIR / new_name
                
                # Handle portada subfolder
                if img_file.parent.name == "portada":
                    new_name = f"{prefix}portada_{img_file.name}"
                    dest_path = IMAGES_DIR / new_name
                
                # Calculate relative path for HTML reference
                old_rel_path = img_file.relative_to(PROJECT_DIR)
                new_rel_path = dest_path.relative_to(PROJECT_DIR)
                
                path_mapping[str(old_rel_path)] = str(new_rel_path)
                
                # Copy file
                shutil.copy2(img_file, dest_path)
                print(f"✅ {old_rel_path} → {new_rel_path}")

def update_html_files():
    """Update all HTML files with new image paths."""
    print("\n🔗 Updating HTML references...\n")
    
    html_files = list(PROJECT_DIR.glob("*.html"))
    
    for html_file in html_files:
        content = html_file.read_text(encoding='utf-8')
        original_content = content
        
        # Replace all old paths with new paths
        for old_path, new_path in path_mapping.items():
            # Escape special regex characters and replace both variations
            old_path_escaped = re.escape(old_path)
            content = re.sub(old_path_escaped, new_path, content)
        
        if content != original_content:
            html_file.write_text(content, encoding='utf-8')
            print(f"✅ Updated: {html_file.name}")
        else:
            print(f"⏭️  No changes: {html_file.name}")

def main():
    move_images()
    update_html_files()
    print(f"\n{'='*50}")
    print("✨ Image reorganization complete!")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()
