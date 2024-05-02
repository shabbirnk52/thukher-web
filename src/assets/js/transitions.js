const swup = new Swup({
    cache: false
});
var baseURL = "";
if (window.location.host == 'designs.mpp.com.kw') {
    baseURL = "/newmpp/html";
}
swup.hooks.on('visit:start', (visit) => {
    console.log('Clicked link', visit);
    // console.log('Clicked link', visit.trigger.el); // HTMLAnchorElement
    $(".page-title").css("height", $(".page-title").height());
    $(".page-title h1").css("height", $(".page-title h1").height());
    $(".page-title .breadcrumbs").css("height", $(".page-title .breadcrumbs").height());
    if ($(visit.trigger.el).hasClass("nav-link")) {
        $(".navbar-nav .nav-item.nav-link.active").removeClass("active");
        $(visit.trigger.el).addClass("active");
    }
    if (visit.to.url == `${baseURL}index.html` || visit.to.url == `${baseURL}/` || visit.to.url == `${baseURL}/index.html`) {
        $("html").addClass("to-home");
    }
});
swup.hooks.on('content:replace', (visit) => {
    var $destinationHTML = $('<div id="body-mock">' + visit.to.html.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/ig, '') + '</div>');
    if (visit.to.url == `${baseURL}index.html` || visit.to.url == `${baseURL}/` || visit.to.url == `${baseURL}/index.html` || visit.to.url == `${baseURL}/index-rtl.html`) {
        console.log("Navigating to Home");
        $(".page-title").remove();
    }
    else {
        $("#header-carousel").remove();
        if (visit.from.url == `${baseURL}index.html` || visit.from.url == `${baseURL}/` || visit.from.url == `${baseURL}/index.html` || visit.from.url == `${baseURL}/index-rtl.html`) {
            $("html").addClass("from-home");
            var pageTitleSection = $destinationHTML.find(".breadcrumbs").closest(".page-title").prop("outerHTML");
            $(pageTitleSection).insertBefore("main");
        }
    }
});
swup.hooks.before('content:replace', (visit) => {
    var $destinationHTML = $('<div id="body-mock">' + visit.to.html.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/ig, '') + '</div>');
    var pageTitle = $destinationHTML.find(".breadcrumbs").closest(".page-title").find("h1").html();
    $(".page-title h1").html(pageTitle);
    $(".page-title .breadcrumbs").html($destinationHTML.find(".breadcrumbs").html());
});
swup.hooks.on('visit:end', (visit) => {
    $("html").removeClass("from-home to-home");
});
swup.hooks.on('page:view', (visit) => {
    initAllModules();
});
// swup.hooks.on('animation:out:start', (visit) => {
//   $("main>div").each(function (index) {
//     setTimeout(function () {
//       $(this).fadeOut(500);
//     }, index * 500)
//   });
// });

// swup.hooks.on('page:view', (visit) => {
//   console.log("Page View");
//   console.log(visit);
//   if ($(visit.trigger.el).hasClass("nav-link")) {
//     $(".navbar-nav .nav-item.nav-link.active").removeClass("active");
//     $(visit.trigger.el).addClass("active");
//   }
// });