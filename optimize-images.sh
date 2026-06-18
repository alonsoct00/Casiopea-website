#!/bin/bash

# ========================================
# Image Optimization Script
# Converts JPG/PNG images to WebP format
# Maintains original files as fallback
# ========================================

PROJECT_DIR="/Users/alonsoct/Sites/Casiopea-website"
QUALITY=80
TOTAL_ORIGINAL=0
TOTAL_WEBP=0
TOTAL_SAVED=0

echo "🖼️  Starting image optimization to WebP format..."
echo "=================================================="
echo "Quality: $QUALITY"
echo "Directory: $PROJECT_DIR"
echo ""

# Function to convert images in a directory
convert_images_in_dir() {
    local dir=$1
    local dir_name=$(basename "$dir")
    
    # Convert JPG files
    if ls "$dir"/*.jpg >/dev/null 2>&1; then
        echo "📁 Processing JPGs in: $dir_name/"
        for img in "$dir"/*.jpg; do
            filename=$(basename "$img")
            webp_file="${img%.jpg}.webp"
            
            # Get file sizes
            original_size=$(stat -f%z "$img" 2>/dev/null || echo 0)
            
            # Convert to WebP
            cwebp -q $QUALITY "$img" -o "$webp_file" 2>/dev/null
            
            # Get WebP size
            webp_size=$(stat -f%z "$webp_file" 2>/dev/null || echo 0)
            
            # Calculate savings
            if [ $original_size -gt 0 ]; then
                saved=$((original_size - webp_size))
                percent=$((saved * 100 / original_size))
                TOTAL_ORIGINAL=$((TOTAL_ORIGINAL + original_size))
                TOTAL_WEBP=$((TOTAL_WEBP + webp_size))
                TOTAL_SAVED=$((TOTAL_SAVED + saved))
                printf "   ✓ %-40s | %6d → %6d bytes | %3d%% saved\n" "$filename" "$original_size" "$webp_size" "$percent"
            fi
        done
    fi
    
    # Convert PNG files
    if ls "$dir"/*.png >/dev/null 2>&1; then
        echo "📁 Processing PNGs in: $dir_name/"
        for img in "$dir"/*.png; do
            filename=$(basename "$img")
            webp_file="${img%.png}.webp"
            
            # Get file sizes
            original_size=$(stat -f%z "$img" 2>/dev/null || echo 0)
            
            # Convert to WebP
            cwebp -q $QUALITY "$img" -o "$webp_file" 2>/dev/null
            
            # Get WebP size
            webp_size=$(stat -f%z "$webp_file" 2>/dev/null || echo 0)
            
            # Calculate savings
            if [ $original_size -gt 0 ]; then
                saved=$((original_size - webp_size))
                percent=$((saved * 100 / original_size))
                TOTAL_ORIGINAL=$((TOTAL_ORIGINAL + original_size))
                TOTAL_WEBP=$((TOTAL_WEBP + webp_size))
                TOTAL_SAVED=$((TOTAL_SAVED + saved))
                printf "   ✓ %-40s | %6d → %6d bytes | %3d%% saved\n" "$filename" "$original_size" "$webp_size" "$percent"
            fi
        done
    fi
}

# Process all JPG and PNG files recursively under the project directory
find "$PROJECT_DIR" \( -iname '*.jpg' -o -iname '*.png' \) -type f | while read -r img; do
    filename=$(basename "$img")
    extension="${img##*.}"
    webp_file="${img%.*}.webp"

    # Get file sizes
    original_size=$(stat -f%z "$img" 2>/dev/null || echo 0)

    # Convert to WebP
    cwebp -q $QUALITY "$img" -o "$webp_file" 2>/dev/null

    # Get WebP size
    webp_size=$(stat -f%z "$webp_file" 2>/dev/null || echo 0)

    # Calculate savings
    if [ $original_size -gt 0 ]; then
        saved=$((original_size - webp_size))
        percent=$((saved * 100 / original_size))
        TOTAL_ORIGINAL=$((TOTAL_ORIGINAL + original_size))
        TOTAL_WEBP=$((TOTAL_WEBP + webp_size))
        TOTAL_SAVED=$((TOTAL_SAVED + saved))
        printf "   ✓ %-40s | %6d → %6d bytes | %3d%% saved\n" "$filename" "$original_size" "$webp_size" "$percent"
    fi
done

# Print summary
echo ""
echo "=================================================="
echo "✅ OPTIMIZATION COMPLETE"
echo "=================================================="
echo "Total original size:  $(numfmt --to=iec-i --suffix=B $TOTAL_ORIGINAL 2>/dev/null || echo $TOTAL_ORIGINAL' bytes')"
echo "Total WebP size:      $(numfmt --to=iec-i --suffix=B $TOTAL_WEBP 2>/dev/null || echo $TOTAL_WEBP' bytes')"
echo "Total saved:          $(numfmt --to=iec-i --suffix=B $TOTAL_SAVED 2>/dev/null || echo $TOTAL_SAVED' bytes')"
if [ $TOTAL_ORIGINAL -gt 0 ]; then
    percent=$((TOTAL_SAVED * 100 / TOTAL_ORIGINAL))
    echo "Reduction:            $percent%"
fi
echo ""
echo "✨ All images converted to WebP format!"
echo "✨ Original files preserved for fallback"
echo ""
