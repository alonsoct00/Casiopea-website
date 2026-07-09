/*

Tera JS
Version 2.5
Made by Themanoid

*/

class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <section>
                <a class='h-link brand' href='index.html'>
                    <span class="img-logo">
                        <img src="images/logo_casiopea_blanco.gif" alt="CASIOPEA" title="CASIOPEA" class="log-img-white" />
                    </span>
                </a>
                <ul id='navigation'>
                    <div class='trigger'>
                        <div class='bar'></div>
                        <div class='bar'></div>
                        <div class='bar'></div>
                    </div>
                    <li>
                        <a class="h-link" href='index.html' data-i18n="nav.home">Inicio</a>
                    </li>
                    <li>
                        <a class="h-link" href='about-us.html' data-i18n="nav.about">Quiénes somos</a>
                    </li>
                    <li>
                        <a class="h-link" href='proyectos.html' data-i18n="nav.projects">Proyectos</a>
                        <ul id="filter-nav" style="display: none">
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#all' data-filter='*' data-i18n="filters.all">All</a>
                            </li>
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#motion-graphics' data-filter=".motion-graphics" data-i18n="filters.motionGraphics">Motion graphics</a>
                            </li>
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#stop-motion' data-filter=".stop-motion" data-i18n="filters.stopMotion">Stop motion</a>
                            </li>
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#animated-cartoons' data-filter=".animated-cartoons" data-i18n="filters.animatedCartoons">Dibujo animado</a>
                            </li>
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#video-i' data-filter=".video-i" data-i18n="filters.videoIntervened">Video intervenido</a>
                            </li>
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#fonima' data-filter=".fonima" data-i18n="filters.fonima">Fonima</a>
                            </li>
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#workshops' data-filter=".workshops" data-i18n="filters.workshops">Talleres</a>
                            </li>
                            <li>
                                <a class="h-link filter-nav-anchor" href='proyectos.html#visuals' data-filter=".visuals" data-i18n="filters.visuals">Visuales</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a class="h-link" href='contacto.html' data-i18n="nav.contact">Contacto</a>
                    </li>
                    <li class="lang-switch" role="group" data-i18n-aria-label="langSwitch.label" aria-label="Idioma">
                        <button type="button" class="lang-btn" data-lang="es" aria-pressed="true">ES</button>
                        <span aria-hidden="true">|</span>
                        <button type="button" class="lang-btn" data-lang="en" aria-pressed="false">EN</button>
                    </li>
                </ul>
                <div class="sr-only" aria-live="polite" id="i18n-announcer"></div>
            </section>

         `;
  }
}

//Footer

class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
                <section class='text-center'>
                <div class='social'>
                    <a class='icon fa fa-vimeo' href='https://vimeo.com/casiopea' target="_blank" data-i18n-aria-label="footer.social.vimeo" aria-label="Vimeo"></a>
                    <a class='icon fa fa-behance' href='https://www.behance.net/somoscasiopea' target="_blank" data-i18n-aria-label="footer.social.behance" aria-label="Behance"></a>
                    <a class='icon fa fa-facebook' href='https://www.facebook.com/SomosCasiopea' target="_blank" data-i18n-aria-label="footer.social.facebook" aria-label="Facebook"></a>
                    <a class='icon fa fa-instagram' href='https://www.instagram.com/somoscasiopea/' target="_blank" data-i18n-aria-label="footer.social.instagram" aria-label="Instagram"></a>
                    <a class='icon fa fa-youtube' href='https://www.youtube.com/channel/UCYPkq5tLezsfBVEY1_1mcvA' target="_blank" data-i18n-aria-label="footer.social.youtube" aria-label="YouTube"></a>
                </div>
                <div class='copy'>
                    <p data-i18n="footer.copyright">&copy; 2026 Casiopea. Todos los derechos reservados.</p>
                </div>
            </section>

    `;
  }
}

customElements.define("main-header", Header);
customElements.define("main-footer", Footer);

(function ($) {
  "use strict"; // Strict mode

  /*
        Portfolio scripts
    */

  //  Define the portfolio grid
  var $grid = $("#grid");

  //  Show filter options on trigger click
  $("#filter-trigger").on("tap click", function () {
    $("#filter-trigger").fadeOut(200, function () {
      $("#filters").fadeIn(500);
    });
  });

  //  On filter click, filter grid
  $("#filters").on("tap click", "button", function (e) {
    e.stopPropagation();
    var filterValue = $(this).attr("data-filter");
    $grid.isotope({ filter: filterValue });
    $(".item").addClass("visible");
    e.preventDefault();
  });

  $(".filter-nav-anchor").each(function () {
    var filterNav = $(this).attr("data-filter");
    $(this).on("click", function (event) {
      $("#casiopea-projects").find("#filter-trigger").trigger("tap");
      $grid.isotope({ filter: filterNav });
      $(".item").addClass("visible");
      event.preventDefault();
      //console.log(filterNav);
    });
  });

  // Back to top button
  var $toTop = $('<div class="back-to-top"></div>');
  $("body").append($toTop);
  $("body").on("tap", ".back-to-top", function (e) {
    $("html,body").animate({ scrollTop: 0 });
    e.preventDefault();
  });

  //  Scroll effects
  $(window).scroll(function () {
    var scrolled = $(window).scrollTop();
    var scrolledPercentage =
      (100 - (scrolled / $(window).height()) * 100) / 100;
    $(".jumbotron").css("opacity", scrolledPercentage);
    if (scrolled > 200)
      $toTop.addClass("active"); // Back to top button
    else $toTop.removeClass("active");
  });

  $(window).load(function () {
    $(".container-fluid").addClass("loaded"); // Initialize the container
    $grid.isotope(); // Set the grid to isotope

    $(".item").waypoint(
      function () {
        $(this).addClass("visible"); // Show items
        $grid.isotope(); // Reload isotope items
      },
      { offset: "70%" },
    );

    $(".fadeIn").waypoint(
      function () {
        // Fade in every .fadeIn class element
        $(this).addClass("visible");
      },
      { offset: "70%" },
    );

    var scrolled = $(window).scrollTop();
    if (scrolled > 200) $toTop.addClass("active"); // Back to top button

    // Placeholder fix for older browsers
    $("input, textarea").placeholder();
  });

  $("header").affix(); // Affix the header

  $(".trigger").on("tap", function (e) {
    e.stopPropagation();
    $("#navigation").toggleClass("active"); // Toggle responsive menu
  });

  $("html").on("tap", function () {
    // Used to hide the responsive navigation on click outside
    $("#navigation").removeClass("active");
  });

  // Fade effect on navigation / header links
  $("a.h-link").on("tap", function (e) {
    e.stopPropagation();
    var href = $(this).attr("href");
    if (
      href != "#" &&
      !$(this).hasClass("lightbox") &&
      !$(this).hasClass("anchor")
    ) {
      $("body").fadeOut(400, function () {
        window.location = href; // Go to url after smooth transition
      });
      e.preventDefault();
    }
    if ($(this).hasClass("anchor")) {
      var href = $(this).attr("href");
      $("html,body").animate(
        {
          scrollTop: $(href).offset().top - 50 + "px",
        },
        800,
      );
      $("#navigation").removeClass("active");
      e.preventDefault();
    }
  });

  //Fixes Firefox back button issue
  $(window).bind("unload", function () {
    // Nothing needed here :-)
  });

  $(window).bind("pageshow", function (event) {
    if (event.originalEvent.persisted) {
      window.location.reload();
    }
  });

  $('<a href="/proyectos.html" id="back-cta" data-i18n-en="Back">Regresar</a>').insertBefore(
    ".other-projects-block",
  );
})(jQuery);

document.addEventListener("keydown", (e) => {
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
  if (isCmdOrCtrl && (e.key === "+" || e.key === "-" || e.key === "=")) {
    e.preventDefault();
  }
});
document.addEventListener(
  "wheel",
  (e) => {
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
    if (isCmdOrCtrl) e.preventDefault();
  },
  { passive: false },
);

// ========================================
// LAZY LOADING - Image & Video Optimization
// ========================================
// Initializes lazy loading for images and videos to improve page performance
// Usage: add data-src attribute to img tags and loading="lazy" attribute to video tags

document.addEventListener('DOMContentLoaded', function() {
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    initLazyLoadingImages();
    initLazyLoadingVideos();
  } else {
    // Fallback for older browsers - load all images immediately
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  }
});

// Initialize lazy loading for images
function initLazyLoadingImages() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Support for responsive images with picture element
        if (img.parentElement.tagName === 'PICTURE') {
          const sources = img.parentElement.querySelectorAll('source[data-srcset]');
          sources.forEach(source => {
            source.srcset = source.dataset.srcset;
          });
        }
        
        // Load main image
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        
        // Add loaded class for fade-in animation
        img.classList.add('lazy-loaded');
        
        // Stop observing this image
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px' // Start loading 50px before entering viewport
  });

  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Initialize lazy loading for videos
function initLazyLoadingVideos() {
  const videoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        
        // Load video sources
        video.querySelectorAll('source[data-src]').forEach(source => {
          source.src = source.dataset.src;
        });
        
        // Reload video to start playback
        video.load();
        video.classList.add('lazy-loaded');
        
        observer.unobserve(video);
      }
    });
  }, {
    rootMargin: '100px'
  });

  // Observe all videos with data-src in sources
  document.querySelectorAll('video source[data-src]').forEach(source => {
    if (source.parentElement && source.parentElement.tagName === 'VIDEO') {
      videoObserver.observe(source.parentElement);
    }
  });
}

// CSS for fade-in animation on lazy-loaded images
const style = document.createElement('style');
style.textContent = `
  img[data-src] {
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
  }
  
  img.lazy-loaded {
    opacity: 1;
  }
  
  /* Placeholder background while loading */
  img[data-src] {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
document.head.appendChild(style);