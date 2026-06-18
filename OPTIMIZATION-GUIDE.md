# 🚀 Optimización de Performance - CASIOPEA

## ✅ Lo que se ha implementado

### Lazy Loading de Imágenes
Se agregó un sistema automático de lazy loading en `javascripts/functions.js` que:

- ✅ Carga imágenes solo cuando entran en el viewport
- ✅ Compatible con navegadores antiguos (fallback)
- ✅ Animación fade-in automática
- ✅ Placeholder con efecto skeleton mientras carga
- ✅ Soporte para imágenes responsivas con `<picture>`

### Lazy Loading de Videos
- ✅ Carga de sources de video bajo demanda
- ✅ Reduce carga inicial de página

---

## 📝 Cómo usar Lazy Loading

### Imágenes Básicas
```html
<!-- Antes -->
<img src="imagen.jpg" alt="Descripción">

<!-- Después (con lazy loading) -->
<img data-src="imagen.jpg" src="placeholder.gif" alt="Descripción" loading="lazy">

<!-- O sin placeholder visible (recomendado) -->
<img data-src="imagen.jpg" alt="Descripción" loading="lazy">
```

### Imágenes Responsivas (Picture Element)
```html
<picture>
    <source media="(max-width: 768px)" data-srcset="imagen-mobile.jpg">
    <img data-src="imagen-desktop.jpg" alt="Descripción" loading="lazy">
</picture>
```

### Videos
```html
<!-- Antes -->
<video playsinline muted autoplay loop>
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
</video>

<!-- Después (con lazy loading) -->
<video playsinline muted autoplay loop loading="lazy">
    <source data-src="video.mp4" type="video/mp4">
    <source data-src="video.webm" type="video/webm">
</video>
```

---

## 🎬 Convertir Videos a Formatos Optimizados

### Requisitos
```bash
# Instalar ffmpeg si no lo tienes
brew install ffmpeg
```

### 1. Comprimir MP4 para Web
```bash
# Reducir bitrate sin perder mucha calidad (bueno para web)
ffmpeg -i video-original.mov -c:v libx264 -preset slow -crf 23 -c:a aac -b:a 128k video-optimizado.mp4

# Parámetros:
# -preset: ultrafast|superfast|veryfast|faster|fast|medium|slow|slower|veryslow
# -crf: 0-51 (menor = mejor calidad, 23 es estándar)
# -b:a: bitrate audio (128k es suficiente para web)
```

### 2. Crear versión Mobile (más ligera)
```bash
# Reducir resolución para mobile
ffmpeg -i video.mp4 -s 1080x1920 -c:v libx264 -preset slow -crf 28 video-mobile.mp4

# Parámetros comunes:
# 1920x1080 (Full HD)
# 1280x720 (HD)
# 1080x1920 (Vertical Full HD)
# 720x1280 (Vertical HD)
```

### 3. Convertir a WebM (formato más comprimido)
```bash
# WebM es más pequeño que MP4 pero menos compatible
ffmpeg -i video.mp4 -c:v libvpx-vp9 -crf 30 -c:a libopus video.webm

# Para navegadores modernos, ofrecer:
# 1. WebM (más pequeño)
# 2. MP4 (fallback compatible)
```

### 4. Ejemplo Completo para Hero Video
```bash
#!/bin/bash
# Script para optimizar videos del hero

# Desktop - MP4 optimizado
ffmpeg -i REEL_INICIO_V02.mov -c:v libx264 -preset slow -crf 23 -c:a aac -b:a 128k REEL_INICIO_V02-opt.mp4

# Desktop - WebM (alternativa)
ffmpeg -i REEL_INICIO_V02.mov -c:v libvpx-vp9 -crf 30 -c:a libopus REEL_INICIO_V02-opt.webm

# Mobile - MP4 comprimido
ffmpeg -i REEL2026_WEB_VERTICAL_V03.mov -s 1080x1920 -c:v libx264 -preset slow -crf 28 -c:a aac -b:a 128k REEL2026_WEB_VERTICAL_V03-opt.mp4

# Mobile - WebM
ffmpeg -i REEL2026_WEB_VERTICAL_V03.mov -s 1080x1920 -c:v libvpx-vp9 -crf 30 -c:a libopus REEL2026_WEB_VERTICAL_V03-opt.webm
```

### 5. Implementar videos optimizados en HTML
```html
<!-- Soporte WebM + MP4 fallback -->
<video class="video" id="home-hero-video" poster="media/reel-poster.jpg" playsinline muted autoplay loop loading="lazy">
    <!-- Navegadores modernos usan WebM (más pequeño) -->
    <source src="videos/REEL_INICIO_V02-opt.webm" type="video/webm">
    <!-- Fallback para navegadores que no soportan WebM -->
    <source src="videos/REEL_INICIO_V02-opt.mp4" type="video/mp4">
</video>
```

---

## 🖼️ Convertir Imágenes a WebP

### Requisitos
```bash
# Instalar cwebp
brew install webp
```

### 1. Convertir PNG o JPG a WebP
```bash
# Conversión individual
cwebp -q 80 imagen.jpg -o imagen.webp

# Parámetros:
# -q: calidad (0-100, recomendado 75-85)
# -m: método (0-6, más alto = mejor calidad pero más lento)
```

### 2. Convertir en lote (todas las imágenes)
```bash
#!/bin/bash
# Script para convertir todas las imágenes a WebP

# Convertir JPGs
for img in images/*.jpg; do
    cwebp -q 80 "$img" -o "${img%.jpg}.webp"
done

# Convertir PNGs
for img in images/*.png; do
    cwebp -q 80 "$img" -o "${img%.png}.webp"
done

# Mostrar compresión lograda
echo "Compresión completada. Comparación de tamaños:"
du -sh images/*.jpg images/*.webp | sort -h
```

### 3. Implementar imágenes WebP con fallback
```html
<!-- Navegadores modernos cargan WebP (más pequeño), otros cargan JPG -->
<picture>
    <source srcset="imagen.webp" type="image/webp">
    <source srcset="imagen.jpg" type="image/jpeg">
    <img src="imagen.jpg" alt="Descripción" loading="lazy">
</picture>
```

### 4. Lazy loading + WebP (combinado)
```html
<picture>
    <source data-srcset="imagen.webp" type="image/webp">
    <source data-srcset="imagen.jpg" type="image/jpeg">
    <img data-src="imagen.jpg" alt="Descripción" loading="lazy">
</picture>
```

---

## 📊 Herramientas para Validar Mejoras

### Verificar tamaño de archivos
```bash
# Comparar tamaño antes y después
ls -lh imagen.jpg imagen.webp
du -sh videos/
du -sh images/
```

### Test de rendimiento online
- Google PageSpeed Insights: https://pagespeed.web.dev/
- WebPageTest: https://www.webpagetest.org/
- GTmetrix: https://gtmetrix.com/

### Monitorear en dev
```bash
# Abrir developer tools y ver Network tab
# Filtrar por imágenes y videos
# Verificar que usen lazy loading
```

---

## 🗂️ Plan de Implementación

### Fase 1: Videos Hero (Mayor impacto)
1. [ ] Comprimir MP4s existentes (50-70% reducción)
2. [ ] Crear versión WebM
3. [ ] Crear versión mobile optimizada
4. [ ] Actualizar HTML en `index.html`

### Fase 2: Imágenes Generales
1. [ ] Convertir `images/*.jpg` a WebP
2. [ ] Convertir `images/*.png` a WebP
3. [ ] Mantener fallbacks JPG/PNG
4. [ ] Actualizar referencias en HTML

### Fase 3: Imágenes de Proyectos
1. [ ] Procesar carpetas `projects/*/media/`
2. [ ] Aplicar lazy loading a galería
3. [ ] Convertir a WebP

### Fase 4: Testing
1. [ ] Validar en PageSpeed Insights
2. [ ] Testear en móvil
3. [ ] Verificar compatibilidad navegadores
4. [ ] Hacer push a Hostinger

---

## 💡 Impacto Esperado

| Optimización | Reducción | Dificultad |
|--------------|-----------|-----------|
| Comprimir videos | 50-70% | ⭐ Fácil |
| Convertir a WebP | 30-50% | ⭐ Fácil |
| Lazy loading | 10-30% | ⭐ Hecho |
| Múltiples formatos | 5-15% | ⭐⭐ Medio |

**Ahorro total esperado: 60-80% en tamaño de assets**

---

## 🔧 Scripts Listos para Usar

### Script All-in-One (copiar en terminal)
```bash
#!/bin/bash
cd /Users/alonsoct/Sites/Casiopea-website

echo "🎬 Optimizando videos..."
ffmpeg -i videos/REEL_INICIO_V02.mov -c:v libx264 -preset slow -crf 23 -c:a aac -b:a 128k videos/REEL_INICIO_V02-opt.mp4
ffmpeg -i videos/REEL2026_WEB_VERTICAL_V03.mov -s 1080x1920 -c:v libx264 -preset slow -crf 28 -c:a aac -b:a 128k videos/REEL2026_WEB_VERTICAL_V03-opt.mp4

echo "🖼️ Optimizando imágenes..."
for img in images/*.jpg; do
    cwebp -q 80 "$img" -o "${img%.jpg}.webp"
done

for img in images/*.png; do
    cwebp -q 80 "$img" -o "${img%.png}.webp"
done

echo "✅ Optimización completada!"
```

---

## 📝 Notas Importantes

- **Lazy loading ya está activado** en `functions.js`
- Solo necesitas agregar `data-src` a las imágenes
- Los navegadores antiguos cargan imágenes automáticamente (fallback)
- Hostinger maneja bien WebP en la mayoría de casos
- Siempre mantener fallbacks para compatibilidad

---

**Próximos pasos**: Convertir videos y imágenes, luego hacer push a Hostinger para ver mejoras en vivo.

*Actualizado: 2026-06-18*
