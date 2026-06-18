# 🎬 Casiopea - Estudio de Animación

**CASIOPEA** es un estudio de animación digital ubicado en la Ciudad de México, dirigido por **Andrea Mondragón** y **Sandra Medina**. Exploramos lenguajes visuales que mutan con cada proyecto mediante la mezcla de técnicas digitales y análogas.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)
- [Instalación y Uso](#instalación-y-uso)
- [Portafolio de Proyectos](#portafolio-de-proyectos)
- [Páginas Principales](#páginas-principales)
- [Cómo Agregar Nuevos Proyectos](#cómo-agregar-nuevos-proyectos)
- [Contacto](#contacto)

## 📖 Descripción

CASIOPEA es un sitio web estático que funciona como portafolio profesional y vitrina de proyectos de animación. El sitio presenta trabajos de motion graphics, stop motion, dibujo animado, video intervenido y otras técnicas audiovisuales.

## ✨ Características

- **Portafolio dinámico**: Galería de proyectos filtrable por categoría
- **Diseño responsivo**: Totalmente adaptable a dispositivos móviles y desktop
- **Animaciones de Lottie**: Animaciones JSON embebidas en proyectos
- **Videos en múltiples formatos**: Soporte para MP4 y MOV
- **Componentes web personalizados**: Encabezado y pie de página reutilizables
- **Optimización SEO**: Meta tags y estructura HTML semántica
- **Contacto**: Formulario de contacto con validación

## 📁 Estructura del Proyecto

```
Casiopea-website/
├── index.html              # Página principal (inicio)
├── about-us.html           # Quiénes somos
├── proyectos.html          # Galería de proyectos
├── contacto.html           # Página de contacto
├── faq.html                # Preguntas frecuentes
├── 404.html                # Página de error 404
├── README.md               # Este archivo
├── favicon.ico             # Ícono del sitio
├── fonts/                  # Fuentes personalizadas
├── images/                 # Imágenes estáticas (PNG, JPG)
│   ├── faqs/              # Imágenes para sección FAQ
│   ├── tera-slider/       # Imágenes para slider
│   └── ...                # Imágenes generales del sitio
├── videos/                 # Videos del hero (MP4, MOV)
│   ├── REEL_INICIO_V02.mp4
│   ├── REEL2026_WEB_VERTICAL_V03.mp4
│   └── ...
├── javascripts/            # Archivos JavaScript
│   ├── jquery.min.js       # jQuery
│   ├── bootstrap.min.js    # Bootstrap JS
│   ├── functions.js        # Funciones personalizadas
│   ├── tera-slider.js      # Slider personalizado
│   ├── tera-lightbox.js    # Lightbox personalizado
│   ├── isotope.pkgd.min.js # Filtrado de galería
│   ├── validation.js       # Validación de formularios
│   └── ...
├── stylesheets/            # Estilos CSS
│   ├── bootstrap.min.css   # Bootstrap CSS
│   ├── style.css           # Estilos principales
│   ├── style.min.css       # Estilos minificados
│   ├── the-casiopea-styles.css  # Estilos personalizados
│   └── ...
├── php/                    # Lógica backend (envío de emails)
│   └── email.php           # Procesamiento de contacto
└── projects/               # Detalles de proyectos individuales
    ├── kidoo.html
    ├── dos-camaleones.html
    ├── birdsong.html
    ├── ambulante.html
    ├── ...
    └── [nombre-proyecto]/  # Carpeta con medios por proyecto
        └── media/
            ├── portada/    # Imágenes de portada
            └── *.lottie.json # Animaciones Lottie
```

## 🛠️ Tecnologías

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos responsive con Bootstrap
- **JavaScript**: jQuery para interactividad
- **Bootstrap**: Framework CSS responsivo
- **Font Awesome**: Iconografía

### Librerías y Plugins
- **jQuery**: Manipulación del DOM
- **Isotope**: Filtrado de galería de proyectos
- **Lottie**: Animaciones JSON
- **Custom Slider**: Tera Slider personalizado
- **Custom Lightbox**: Tera Lightbox para galerías
- **Waypoints**: Animaciones al scroll

### Backend (Mínimo)
- **PHP**: Procesamiento de formulario de contacto

## 🚀 Instalación y Uso

### Requisitos
- Un servidor web (Apache, Nginx, etc.)
- PHP 5.6+ (para formulario de contacto)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tuusuario/Casiopea-website.git
   cd Casiopea-website
   ```

2. **Deploying localmente**
   ```bash
   # Opción 1: Usando Python
   python3 -m http.server 8000
   
   # Opción 2: Usando PHP
   php -S localhost:8000
   ```

3. **Acceder al sitio**
   ```
   http://localhost:8000
   ```

### Deploying a Producción
- Subir todos los archivos a servidor web con PHP habilitado
- Configurar dominio y SSL
- Verificar que PHP pueda escribir en directorio temporal para envío de emails

## 📂 Portafolio de Proyectos

El sitio contiene los siguientes proyectos (categorías filtradas por Isotope):

### Motion Graphics
- Ambulante
- Poliangular
- Video Explicativo

### Stop Motion
- Dos Camaleones
- Abuelitas Kitchen
- Animasivo

### Dibujo Animado
- Birdsong
- La Catrina
- Song Last Lacandón

### Video Intervenido
- Centavrvs
- Kidoo
- The River Kon

### Fonima
- Cutout Fest 2018
- Hise
- No Se Aceptan Devoluciones

## 📄 Páginas Principales

### index.html
- Hero con video responsive (MP4 para desktop, vertical para móvil)
- Galería destacada de proyectos
- Llamadas a acción

### about-us.html
- Información sobre CASIOPEA
- Datos de directoras (Andrea Mondragón y Sandra Medina)
- Enlaces a redes sociales

### proyectos.html
- Galería filtrable de todos los proyectos
- Filtros: All, Motion Graphics, Stop Motion, Dibujo Animado, Video Intervenido, Fonima
- Lightbox para ver proyectos en detalle

### contacto.html
- Formulario de contacto
- Validación cliente-side con JavaScript
- Procesamiento backend en PHP

### faq.html
- Preguntas frecuentes sobre servicios
- Información de contacto

## 🆕 Cómo Agregar Nuevos Proyectos

### 1. Crear página HTML del proyecto
```bash
# Crear nuevo archivo en projects/
touch projects/nuevo-proyecto.html
```

### 2. Estructura HTML mínima
```html
<!DOCTYPE html>
<html>
<head>
    <title>CASIOPEA - Nuevo Proyecto</title>
    <!-- Meta tags y estilos igual a otros proyectos -->
</head>
<body>
    <!-- Contenido del proyecto -->
</body>
</html>
```

### 3. Crear carpeta de medios
```bash
mkdir -p projects/NombreProyecto/media/portada
```

### 4. Agregar proyecto a la galería (proyectos.html)
```html
<div class="project-item motion-graphics">
    <a href="projects/nuevo-proyecto.html">
        <img src="projects/NombreProyecto/media/portada/preview.jpg" alt="Nuevo Proyecto">
        <h3>Nuevo Proyecto</h3>
    </a>
</div>
```

### 5. Categorías disponibles
- `motion-graphics`
- `stop-motion`
- `animated-cartoons`
- `video-i`
- `fonima`

### 6. Agregar animaciones Lottie (opcional)
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>
<div id="lottie-container"></div>
<script>
    lottie.loadAnimation({
        container: document.getElementById('lottie-container'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'projects/NombreProyecto/media/animacion.lottie.json'
    });
</script>
```

## 📞 Contacto

- **Directoras**: Andrea Mondragón y Sandra Medina
- **Instagram**: [@casiopea_studio](https://instagram.com/casiopea_studio)
- **Email**: Mediante el formulario en contacto.html
- **Ubicación**: Ciudad de México, México

## 📝 Notas de Desarrollo

- El sitio fue actualizado en 2026
- Compatible con navegadores modernos
- Fallbacks HTML5 para IE9
- Optimizado para velocidad y SEO
- Versión minificada de CSS y JS disponibles

## 📄 Licencia

Todos los derechos reservados © CASIOPEA 2024-2026

---

*Último actualizado: 2026-06-18*
