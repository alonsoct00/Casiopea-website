#!/usr/bin/env python3
"""Fix remaining image paths."""

import re
from pathlib import Path

PROJECT_DIR = Path("/Users/alonsoct/Sites/Casiopea-website/projects")
IMAGES_DIR = PROJECT_DIR / "images"

def fix_remaining_paths():
    print("🔧 Fixing remaining image paths...\n")
    
    # Specific mappings for portada images
    mappings = {
        "15-LaCatrina/media/portada/la_catrina_portada": "images/15-LaCatrina_portada_la_catrina_portada",
        "17-NoSeAceptanDevoluciones/media/portada/NoDevoluciones_portada": "images/17-NoSeAceptanDevoluciones_portada_NoDevoluciones_portada",
        "18-VideoExplicativo/media/portada/VideoExplicativo-portada": "images/18-VideoExplicativo_portada_VideoExplicativo-portada",
    }
    
    html_files = [
        "la-catrina.html",
        "no-se-aceptan-devoluciones.html",
        "video-explicativo.html"
    ]
    
    for filename in html_files:
        filepath = PROJECT_DIR / filename
        if not filepath.exists():
            continue
        
        content = filepath.read_text(encoding='utf-8')
        original = content
        
        # Replace each mapping
        for old_path, new_path in mappings.items():
            # Replace with extension variations
            for ext in ['.webp', '.jpg', '.jpeg', '.png']:
                old_full = old_path + ext
                new_full = new_path + ext
                content = content.replace(f'"{old_full}"', f'"{new_full}"')
        
        if content != original:
            filepath.write_text(content, encoding='utf-8')
            print(f"✅ Updated: {filename}")
        else:
            print(f"⏭️  No changes: {filename}")

if __name__ == "__main__":
    fix_remaining_paths()
