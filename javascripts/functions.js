/*

Tera JS
Version 2.5
Made by Themanoid

*/

class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
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
                        <a class="h-link" href='index.html'>Inicio</a>
                    </li>
                    <li>
                        <a href='about-us.html'>Quienes somos</a>
                    </li>
                    <li>
                        <a class="h-link" href='proyectos.html'>Proyectos</a>
                        <ul id="filter-nav">
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#all' data-filter='*'>All</a>
                            </li>
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#motion-graphics' data-filter=".motion-graphics">Motion graphics</a>
                            </li>
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#stop-motion' data-filter=".stop-motion">Stop motion</a>
                            </li>
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#animated-cartoons' data-filter=".animated-cartoons">Dibujo animado</a>
                            </li>
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#video-i' data-filter=".video-i">Video intervenido</a>
                            </li>
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#fonima' data-filter=".fonima">Fonima</a>
                            </li>
                            <li class="filter-nav-item">
                                <a class="h-link filter-nav-anchor" href='proyectos.html#workshops' data-filter=".workshops">Talleres</a>
                            </li>
                            <li>
                                <a class="filter-nav-anchor" href='proyectos.html#visuals' data-filter=".visuals">Visuales</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a class="h-link" href='faq.html'>Preguntas frecuentes</a>
                    </li>
                    <li>
                        <a class="h-link" href='contacto.html'>Contacto</a>
                    </li>
                </ul>
            </section>
                
         `
    }
}

//Footer

class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
                <section class='text-center'>
                <div class='social'>
                    <a class='icon fa fa-dribbble' href='#'></a>
                    <a class='icon fa fa-behance' href='#'></a>
                    <a class='icon fa fa-facebook' href='#'></a>
                    <a class='icon fa fa-instagram' href='#'></a>
                    <a class='icon fa fa-twitter' href='#'></a>
                </div>
                <div class='copy'>
                    <p>&copy; 2022 Casiopea. All Rights Reserved.</p>
                </div>
            </section>

    `

    }
}

customElements.define('main-header', Header);
customElements.define('main-footer', Footer);


(function($) {

    "use strict"; // Strict mode

    /*
        Portfolio scripts
    */

    //  Define the portfolio grid
    var $grid = $('#grid');

    //  Show filter options on trigger click
    $('#filter-trigger').on('tap click', function() {
        $('#filter-trigger').fadeOut(200, function() {
            $('#filters').fadeIn(500);
        });
    });


    //  On filter click, filter grid
    $('#filters').on('tap click', 'button', function(e) {
        e.stopPropagation();
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
        $('.item').addClass('visible');
        e.preventDefault();
    });

    $(".filter-nav-anchor").each(function() {
        var filterNav = $(this).attr('data-filter');
        $(this).on('click', function(event) {
            $('#casiopea-projects').find('#filter-trigger').trigger('tap');
            $grid.isotope({ filter: filterNav });
            $('.item').addClass('visible');
            event.preventDefault();
            //console.log(filterNav);
        });
    });



    // Back to top button
    var $toTop = $('<div class="back-to-top"></div>');
    $('body').append($toTop);
    $('body').on('tap', '.back-to-top', function(e) {
        $('html,body').animate({ scrollTop: 0 });
        e.preventDefault();
    });

    //  Scroll effects
    $(window).scroll(function() {
        var scrolled = $(window).scrollTop();
        var scrolledPercentage = (100 - (scrolled / $(window).height() * 100)) / 100;
        $('.jumbotron').css('opacity', scrolledPercentage);
        if (scrolled > 200)
            $toTop.addClass('active'); // Back to top button
        else
            $toTop.removeClass('active');
    });

    $(window).load(function() {
        $('.container-fluid').addClass('loaded'); // Initialize the container
        $grid.isotope(); // Set the grid to isotope

        $('.item').waypoint(function() {
            $(this).addClass('visible'); // Show items
            $grid.isotope(); // Reload isotope items
        }, { offset: '70%' });

        $('.fadeIn').waypoint(function() { // Fade in every .fadeIn class element
            $(this).addClass('visible');
        }, { offset: '70%' });

        var scrolled = $(window).scrollTop();
        if (scrolled > 200)
            $toTop.addClass('active'); // Back to top button

        // Placeholder fix for older browsers
        $('input, textarea').placeholder();
    });

    $('header').affix(); // Affix the header

    $('.trigger').on('tap', function(e) {
        e.stopPropagation();
        $('#navigation').toggleClass('active'); // Toggle responsive menu
    });

    $('html').on('tap', function() {
        // Used to hide the responsive navigation on click outside
        $('#navigation').removeClass('active');
    });

    // Fade effect on navigation / header links
    $('a.h-link').on('tap', function(e) {
        e.stopPropagation();
        var href = $(this).attr('href');
        if (href != '#' && !$(this).hasClass('lightbox') && !$(this).hasClass('anchor')) {
            $('body').fadeOut(400, function() {
                window.location = href; // Go to url after smooth transition
            });
            e.preventDefault();
        }
        if ($(this).hasClass('anchor')) {
            var href = $(this).attr('href');
            $('html,body').animate({
                scrollTop: ($(href).offset().top) - 50 + 'px'
            }, 800);
            $('#navigation').removeClass('active');
            e.preventDefault();
        }
    })

    //Fixes Firefox back button issue
    $(window).bind("unload", function() {
        // Nothing needed here :-)
    });

    $(window).bind("pageshow", function(event) {
        if (event.originalEvent.persisted) {
            window.location.reload()
        }
    });

})(jQuery);