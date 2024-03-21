"use strict";

$(document).ready(function () {
  // showLoader();
  // Initiate the wowjs JUST ONCE
  console.log("WOW Init", new WOW().init());
  initAllModules();
});

function initAllModules() {
  themeInit();
  initIsotope();
  // initUserThemePreference();
  // initializeSelect2();
  // initializeOffcanvas();
  // sanitizeSummernoteContent();
  // initRadioButtonEvents();
  // initializeAOS();
  // initializeDatePicker();
  // hookMenuLinkDisplay();
  hideLoader();
  // For DEVELOPMENT PURPOSES ONLY
  if ($('html').attr('dir') == 'rtl') {
    $(".language-switch").html("English");
  }

  setTimeout(function () {
    if ($('html').attr('dir') == 'rtl') {
      $('.slick-initialized').each(function () {
        $(this).slick('slickSetOption', 'rtl', true, false).slick('refresh');
      });
    }
  }, 100);
  console.log("document ready");
}
function hookMenuLinkDisplay() {
  if (window.outerWidth < 1200) {
    $(".main-menu-link a").on("click", function (e) {
      $(".submenu-container").removeClass("show");
      if ($("#" + $(this).attr("data-show")).length > 0) {
        e.preventDefault();
        $("#" + $(this).attr("data-show")).addClass("show");
      }
    });
  } else {
    $(".main-menu-link a").on("mouseenter", function () {
      $(".submenu-container").removeClass("show");
      if ($(this).attr("data-show")) $("#" + $(this).attr("data-show")).addClass("show");
    });
  }
}
$(window).on("resize", function () {
  $(".main-menu-link a").off("click mouseenter");
  hookMenuLinkDisplay();
});
$(".menu-link").on("click", function () {
  $(".offcanvas-menu").addClass("show");
  $(window).on("click", function (e) {
    if ($(e.target).closest(".offcanvas-menu-content").length == 0) {
      if ($(e.target).closest(".menu-link").length == 0) {
        $(".offcanvas-menu").removeClass("show");
        $(window).off("click");
      }
    }
  });
});

$(".menu-close-btn").on("click", function () {
  $(".offcanvas-menu").removeClass("show");
});

$(".offcanvas-menu-content").on("mouseleave", function () {
  $(".offcanvas-menu").removeClass("show");
  $(window).off("click");
});

// $(".offcanvas-menu-content").hideOnClickOutside(".offcanvas-menu");

$(".language-switch").click(function () {
  SwitchRTL()
});
function SwitchRTL() {
  // console.log(window.location.pathname);
  if (window.location.pathname == "/") {
    location.href = '/index-rtl.html';
  }
  else {
    if (!window.location.pathname.endsWith("html")) {
      location.href = window.location.pathname + 'index-rtl.html';
    }
    else {
      if (!window.location.pathname.includes('-rtl.html')) {
        location.href = window.location.pathname.slice(0, -5) + '-rtl.html';
      }
      else {
        location.href = window.location.pathname.slice(0, -9) + '.html';
      }
    }
  }
}

/*=============================================
=            Select 2 initialize            =
=============================================*/


function initializeSelect2() {
  if ($('body').css('direction') == 'rtl') {
    $('select:not(.no-search)').each(function () {
      if ($(this).closest(".modal").length) {
        var modalID = "#" + $(this).closest(".modal").attr("id");
        $(this).select2({
          placeholder: $(this).attr("placeholder"),
          dir: "rtl",
          theme: 'bootstrap-5',
          dropdownParent: modalID
        });
      }
      else {
        $(this).select2({
          placeholder: $(this).attr("placeholder"),
          dir: "rtl",
          theme: 'bootstrap-5'
        });
      }
    });
    $('select.no-search').each(function () {
      if ($(this).closest(".modal").length) {
        var modalID = "#" + $(this).closest(".modal").attr("id");
        $(this).select2({
          placeholder: $(this).attr("placeholder"),
          dir: "rtl",
          theme: 'bootstrap-5',
          dropdownParent: modalID,
          minimumResultsForSearch: Infinity
        });
      }
      else {
        $(this).select2({
          placeholder: $(this).attr("placeholder"),
          dir: "rtl",
          theme: 'bootstrap-5',
          minimumResultsForSearch: Infinity
        });
      }
    });
  } else {
    $('select:not(.no-search)').each(function () {
      if ($(this).closest(".modal").length) {
        var modalID = "#" + $(this).closest(".modal").attr("id");
        $(this).select2({
          placeholder: $(this).attr("placeholder"),
          theme: 'bootstrap-5',
          dropdownParent: modalID
        });
      }
      else {
        $(this).select2({
          placeholder: $(this).attr("placeholder"),
          theme: 'bootstrap-5'
        });
      }
    });
    $('select.no-search').each(function () {
      if ($(this).closest(".modal").length) {
        var modalID = "#" + $(this).closest(".modal").attr("id");
        $(this).select2({
          placeholder: $(this).attr("placeholder"),
          theme: 'bootstrap-5',
          dropdownParent: modalID,
          minimumResultsForSearch: Infinity
        });
      }
      else {
        $(this).select2({
          placeholder: $(this).attr("placeholder"),
          theme: 'bootstrap-5',
          minimumResultsForSearch: Infinity
        });
      }
    });
  }
}

/*=====  End of Select 2 initialize  ======*/



/*=============================================
=            AOS Content animation            =
=============================================*/

function initializeAOS() {
  AOS.init({
    duration: 1200,
  })
}

/*=====  End of AOS Content animation  ======*/


function initializeDatePicker() {
  $('[data-plugin-datepicker]').each(function () {
    var $this = $(this),
      opts = {
        format: "dd/mm/yyyy"
      };
    var pluginOptions = $this.data('plugin-options');
    if (pluginOptions)
      opts = pluginOptions;

    $this.datepicker(opts);
  });
}


function showLoader() {
  $('.loader-container').show();
}
function hideLoader() {
  $('.loader-container').fadeOut(function () {
  });
}

/*=============================================
=            Active Menu            =
=============================================*/

$(function () {
  $('.navbar-nav .nav-link').removeClass('active');
  if (document.location.pathname.match(/[^\/]+$/)) {
    var current = document.location.pathname.match(/[^\/]+$/)[0];
    $('.navbar-nav .nav-link').each(function () {
      var $this = $(this);
      // if the current path is like this link, make it active
      if ($this.attr('href').indexOf(current) !== -1) {
        $this.addClass('active');
      }
    })
  }
})

/*=====  End of Active Menu  ======*/

function addInvalidFeedbackStyle() {
  $('head').append('<style type="text/css">.invalid-feedback{display:block !important;}</style>');
}

function isInViewport(selector) {
  var elementTop = $(selector).offset().top;
  var elementBottom = elementTop + $(selector).outerHeight();

  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + $(window).height();

  return elementBottom > viewportTop && elementTop < viewportBottom;
};

function initializeOffcanvas() {
  $(".offcanvas-menu").css("transition", "all 1s ease-in-out");
}

function sanitizeSummernoteContent() {
  $(".summernote-content *").removeAttr("class");
  $(".summernote-content *").removeAttr("style");
  $(".summernote-content *").removeAttr("dir");
  $(".summernote-content *").removeAttr("lang");
  $(".summernote-content table").addClass("table table-bordered");
}

function initRadioButtonEvents() {
  $("[data-radio-conditional-display][name=" + $(this).attr("name") + "]").each(function () {
    $("[data-content-display=" + $(this).attr("data-radio-conditional-display") + "]").hide();
  });

  $("[data-radio-conditional-display]").each(function () {
    if ($(this).is(":checked")) {
      $("[data-content-display=" + $(this).attr("data-radio-conditional-display") + "]").show();
    }
    else {
      $("[data-content-display=" + $(this).attr("data-radio-conditional-display") + "]").hide();
    }
  });
  $(document).on("change", "[data-radio-conditional-display]", function () {

    $("[data-radio-conditional-display][name=" + $(this).attr("name") + "]").each(function () {
      $("[data-content-display=" + $(this).attr("data-radio-conditional-display") + "]").hide();
    });

    if ($(this).is(":checked")) {
      $("[data-content-display=" + $(this).attr("data-radio-conditional-display") + "]").show();
    }
    else {
      $("[data-content-display=" + $(this).attr("data-radio-conditional-display") + "]").hide();
    }
  });
}


$(document).on("click", ".clear-datepicker", function () {
  $(this).siblings("[data-plugin-datepicker],.input-group").find("input").val("");
});

function themeInit() {

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 1);
  };
  spinner();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 45) {
      $('.navbar').addClass('sticky-top shadow-sm');
    } else {
      $('.navbar').removeClass('sticky-top shadow-sm');
    }
  });
  // Glassy Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > $("#header-carousel").height()) {
      $('.navbar').addClass('bg-glass');
    } else {
      $('.navbar').removeClass('bg-glass');
    }
  });

  // Dropdown on mouse hover
  const $dropdown = $(".dropdown");
  const $dropdownToggle = $(".dropdown-toggle");
  const $dropdownMenu = $(".dropdown-menu");
  const showClass = "show";

  $(window).on("load resize", function () {
    if (this.matchMedia("(min-width: 992px)").matches) {
      $dropdown.hover(
        function () {
          const $this = $(this);
          $this.addClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "true");
          $this.find($dropdownMenu).addClass(showClass);
        },
        function () {
          const $this = $(this);
          $this.removeClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "false");
          $this.find($dropdownMenu).removeClass(showClass);
        }
      );
    } else {
      $dropdown.off("mouseenter mouseleave");
    }
  });


  // Facts counter
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000
  });


  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
  });


  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    dots: true,
    loop: true,
    center: true,
    responsive: {
      0: {
        items: 1
      },
      576: {
        items: 1
      },
      768: {
        items: 2
      },
      992: {
        items: 3
      }
    }
  });


  // Vendor carousel
  $('.vendor-carousel').owlCarousel({
    loop: true,
    margin: 45,
    dots: false,
    loop: true,
    autoplay: true,
    smartSpeed: 1000,
    responsive: {
      0: {
        items: 2
      },
      576: {
        items: 4
      },
      768: {
        items: 6
      },
      992: {
        items: 8
      }
    }
  });

}

/*
  ****************************************
  * Function that detects change in color theme
  * preference and get localstorage preference
  ****************************************
  */
function initUserThemePreference() {
  /*
  * Check if Browser Preference is present
  */
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (localStorage.getItem("color-mode") == null || localStorage.getItem("color-mode") == "auto") {
      // dark mode
      $("html").attr("data-bs-theme", "dark");
      $("[data-color-mode=auto]").addClass('active');
    }
  }

  /*
  * Add Event Listener for Change
  */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (localStorage.getItem("color-mode") == null || localStorage.getItem("color-mode") == "auto") {
      const newColorScheme = event.matches ? "dark" : "light";
      if (newColorScheme == "dark") {
        $("html").attr("data-bs-theme", "dark");
        $("[data-color-mode=dark]").addClass('active');
      }
    }
  });

  /*
  * One time, check localstorage value for color-mode
  */
  if (localStorage.getItem("color-mode") == "dark") {
    // dark mode
    $("html").attr("data-bs-theme", "dark");
    $("[data-color-mode=dark]").addClass('active');
  }
  else {
    if (localStorage.getItem("color-mode") == "light") {
      $("[data-color-mode=light]").addClass('active');
    }
  }

  /*
  * On click, update the design of the Theme picker
  */
  $("#color-mode .color-mode-options .dropdown-item").on("click", function () {
    if ($(this).attr("data-color-mode") == "light") {
      $("html").removeAttr("data-bs-theme");
      $("[data-color-mode]").removeClass("active");
      $(this).addClass("active");
      localStorage.setItem("color-mode", "light");
    }
    else {
      if ($(this).attr("data-color-mode") == "dark") {
        $("html").attr("data-bs-theme", "dark");
        $("[data-color-mode]").removeClass("active");
        $(this).addClass("active");
        localStorage.setItem("color-mode", "dark");
      }
      else {
        if ($(this).attr("data-color-mode") == "auto") {
          localStorage.setItem("color-mode", "auto");
          $("[data-color-mode]").removeClass("active");
          $(this).addClass("active");
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            $("html").attr("data-bs-theme", "dark");
          }
          else {
            $("html").removeAttr("data-bs-theme");
          }
        }
      }
    }
  });
}

function initIsotope() {

  var $grid = $('.grid');
  $grid.isotope({
    itemSelector: '.grid-item',
    percentPosition: true,
    masonry: {
      columnWidth: '.grid-sizer',
      // fitWidth: true
    },
  });
  $grid.imagesLoaded().progress(function () {
    $grid.isotope('layout');
  });
  // Layout Isotope on viewport size change
  // $(window).on('resize', function () {
  //     $grid.isotope('layout');
  //     for (var i = 0; i < 5; i++) {
  //         setTimeout(function () {
  //             $grid.isotope('layout');
  //         }, 200);
  //     }
  // });
  $("[data-filter-by]").on("click", function () {
    $grid.isotope({ filter: $(this).attr("data-filter-by") });
  });
}