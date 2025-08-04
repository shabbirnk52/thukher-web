// The require statement tells Node to look into the node_modules folder for a package
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
'use strict';
const {
  src,
  dest,
  watch,
  series,
  parallel
} = require('gulp');
const colors = require('ansi-colors');
const browserSync = require('browser-sync').create();
// const sass = require('gulp-sass');
const sass = require('gulp-sass')(require('sass'));
const bourbon = require('node-bourbon').includePaths;
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const del = require('del');
const panini = require('panini');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const removeCode = require('gulp-remove-code');
const removeLog = require('gulp-remove-logging');
const prettyHtml = require('gulp-pretty-html');
const sassLint = require('gulp-sass-lint');
const htmllint = require('gulp-htmllint');
const jshint = require('gulp-jshint');
const htmlreplace = require('gulp-html-replace');
const newer = require('gulp-newer');
const autoprefixer = require('gulp-autoprefixer');
const accessibility = require('gulp-accessibility');
const babel = require('gulp-babel');
const ghPages = require('gulp-gh-pages');
const purgecss = require('gulp-purgecss')
const chalk = require('chalk');
const rtlcss = require('gulp-rtlcss');
const cache = require('gulp-cache');
const replace = require('gulp-replace');

const log = console.log;

const fs = require('fs');
const path = require('path');
const through2 = require('through2');
const cheerio = require('cheerio');
const Excel = require('exceljs');
// const webp = require('gulp-webp');
const webp = require('imagemin-webp');
const extReplace = require('gulp-ext-replace');
const cleanCSS = require('gulp-clean-css');
const shell = require('gulp-shell');
const moment = require('moment');
var EnglishResourceStructure = [];
var ArabicResourceStructure = [];
var EnglishResourceStructureByPage = [];
var ArabicResourceStructureByPage = [];
var SourceResourceFileDumper = [];


// File paths
const files = {
  scssPath: 'app/scss/**/*.scss',
  jsPath: 'app/js/**/*.js'
}

// ------------ DEVELOPMENT TASKS -------------

// RESET PANINI'S CACHE OF LAYOUTS AND PARTIALS
function resetPages(done) {
  log(chalk.red.bold('---------------CLEARING PANINI CACHE---------------'));
  panini.refresh();
  done();
}

// USING PANINI, TEMPLATE, PAGE AND PARTIAL FILES ARE COMBINED TO FORM HTML MARKUP
function compileHTML() {
  log(chalk.red.bold('---------------COMPILING HTML WITH PANINI---------------'));
  panini.refresh();
  return src('src/pages/**/*.html')
    .pipe(panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      // pageLayouts: {
      // All pages inside src/pages/blog will use the blog.html layout
      //     'blog': 'blog'
      // }
      partials: 'src/partials/',
      helpers: 'src/helpers/',
      data: 'src/data/'
    }))
    .pipe(replace(".png", ".webp")) //Favicons now have PNG instead of png as extension.
    .pipe(replace(".jpg", ".webp"))
    .pipe(replace(".jpeg", ".webp"))
    .pipe(dest('dist'))
  
    .pipe(replace('.html"', '-rtl.html"'))
    .pipe(replace(".html'", "-rtl.html'"))
  
    .pipe(rename({ suffix: '-rtl' }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());

}

// COPY AND TRANSPILE CUSTOM JS
function compileJS() {
  log(chalk.red.bold('---------------COMPILE CUSTOM.JS---------------'));
  return src(['src/assets/js/**/*.js'])
    // .pipe(babel())
    .pipe(dest('dist/assets/js/'))
    .pipe(browserSync.stream());
}

// COMPILE SCSS INTO CSS
function compileSCSS() {
  log(chalk.red.bold('---------------COMPILING SCSS---------------'));
  return src(['src/assets/scss/main.scss'])
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: 'map',
      sourceMap: 'scss',
      includePaths: bourbon
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(dest('dist/assets/css'))
    //Ruchir
    .pipe(browserSync.stream())
    .pipe(rtlcss())
    .pipe(rename({ suffix: '-rtl' }))
    .pipe(dest('dist/assets/css'));
  // .pipe(browserSync.stream());
}
// CHANGE TO MINIFIED VERSIONS OF JS AND CSS


// COPY JS VENDOR FILES
function jsVendor() {
  log(chalk.red.bold('---------------COPY JAVASCRIPT VENDOR FILES INTO DIST---------------'));
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
    'vendors/wow/wow.min.js',
    'vendors/easing/easing.min.js',
    'vendors/waypoints/waypoints.min.js',
    'vendors/counterup/counterup.min.js',
    'vendors/owlcarousel/owl.carousel.min.js',
    // 'vendors/mixitup/mixitup.min.js',
    'vendors/isotope/isotope.min.js',
    'vendors/isotope/packery-mode.pkgd.min.js',
    'vendors/isotope/imagesloaded.pkgd.min.js',
    'node_modules/slick-carousel/slick/slick.min.js',
    'node_modules/slick-animation/slick-animation.min.js',
    // 'node_modules/bs5-lightbox/dist/index.bundle.min.js',
    // 'vendors/select2/js/select2.js',
    // 'vendors/bootstrap-multiselect/js/bootstrap-multiselect.js',
    // 'node_modules/aos/dist/aos.js',
    // 'node_modules/animejs/lib/anime.min.js',
    // 'node_modules/swiper/swiper-bundle.min.js',
    // 'node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
    // 'node_modules/nanogallery2/dist/jquery.nanogallery2.js',
    // 'node_modules/revslider/js/jquery.themepunch.tools.min.js', 
    // 'node_modules/revslider/js/jquery.themepunch.revolution.min.js', 
    // 'node_modules/revslider/js/extensions/revolution.extension.actions.min.js', 
    // 'node_modules/revslider/js/extensions/revolution.extension.carousel.min.js', 
    // 'node_modules/revslider/js/extensions/revolution.extension.kenburn.min.js', 
    // 'node_modules/revslider/js/extensions/revolution.extension.layeranimation.min.js', 
    // 'node_modules/revslider/js/extensions/revolution.extension.migration.min.js', 
    // 'node_modules/revslider/js/extensions/revolution.extension.navigation.min.js', 
    // 'node_modules/revslider/js/extensions/revolution.extension.parallax.min.js', 
    // 'node_modules/revslider/js/extensions/revolution.extension.slideanims.min.js', 
    // 'node_modules/revslider/js/extensions/revolution.extension.video.min.js', 
    // 'vendors/bootstrap-datepicker/bootstrap-datepicker.min.js',

  ])
    .pipe(replace(/^\s*\/\/# sourceMappingURL=.+\.map\s*$/gm, ''))
    .pipe(dest('dist/assets/vendor/js'))
    .pipe(browserSync.stream());
}

// COPY CSS VENDOR FILES
function cssVendor() {
  log(chalk.red.bold('---------------COPY CSS VENDOR FILES INTO DIST---------------'));
  return src([
    'node_modules/animate.css/animate.css',
  ])
    .pipe(dest('dist/assets/vendor/css'))
    .pipe(browserSync.stream());
}

// SCSS LINT
function scssLint() {
  log(chalk.red.bold('---------------SCSS LINTING---------------'));
  return src('src/assets/scss/**/*.scss')
    .pipe(sassLint({
      configFile: '.scss-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
}

// HTML LINTER
function htmlLint() {
  log(chalk.red.bold('---------------HTML LINTING---------------'));
  return src('dist/**/*.html')
    .pipe(htmllint({}, htmllintReporter));
}

function htmllintReporter(filepath, issues) {
  if (issues.length > 0) {
    issues.forEach(function (issue) {
      log(colors.cyan('[gulp-htmllint] ') + colors.white(filepath + ' [' + issue.line + ']: ') + colors.red('(' + issue.code + ') ' + issue.msg));
    });
    process.exitCode = 1;
  } else {
    log(chalk.green.bold('---------------NO HTML LINT ERROR---------------'));
  }
}

// JS LINTER
function jsLint() {
  return src('src/assets/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}

// WATCH FILES
function watchFiles() {
  watch('src/**/*.html', compileHTML);
  watch(['src/{layouts,partials,helpers,data}/**/*'], compileHTML);
  watch(['src/assets/scss/**/*.scss', 'src/assets/scss/*.scss'], compileSCSS);
  watch('src/assets/js/*.js', compileJS);
  watch('src/assets/img/**/*', copyImages);
  watch('src/assets/fav/**/*', copyFavicons);
  watch('src/assets/downloads/**/*', copyDownloads);
  watch('src/assets/videos/**/*', copyVideos);
  watch('src/assets/img/**/*', compressImages);

  // watch('src/**/*.html', updateHtmlImageSrc);  
  // watch(['src/{layouts,partials,helpers,data}/**/*'],updateHtmlImageSrc);
  // watch('src/assets/img/**/*', updateHtmlImageSrc);
}

// BROWSER SYNC
function browserSyncInit(done) {
  log(chalk.red.bold('---------------BROWSER SYNC INIT---------------'));
  browserSync.init({
    server: './dist'
  });
  return done();
}

// DEPLOY TO GIT
function deploy() {
  return src('/*')
    .pipe(ghPages({
      remoteUrl: 'https://github.com/johndavemanuel/bootstrap4-gulp-starter-template.git',
      branch: 'master',
      message: 'Automated push of contents via gulp'
    }));
}

// ------------ OPTIMIZATION TASKS -------------

// COPIES AND MINIFY IMAGE TO DIST
function copyImages() {
  log(chalk.red.bold('---------------COPYING IMAGES---------------'));
  return src('src/assets/img/**/*.+(gif|svg|ico|webmanifest)')
    .pipe(newer('dist/assets/img/'))
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(dest('dist/assets/img/'))
    .pipe(browserSync.stream());
}
function copyFavicons() {
  log(chalk.red.bold('---------------COPYING FAVICONS---------------'));
  return src(['src/assets/fav/**/*'])
    .pipe(newer('dist/assets/fav/'))
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(dest('dist/assets/fav/'))
    .pipe(browserSync.stream());
}
function copyDownloads() {
  log(chalk.red.bold('---------------COPYING DOWNLOADS---------------'));
  return src(['src/assets/downloads/**/*'])
    .pipe(dest('dist/assets/downloads/'))
    .pipe(browserSync.stream());
}
function compressImages() {
  log(chalk.red.bold('---------------OPTIMIZING IMAGES---------------'));
  return src('src/assets/img/**/*.+(png|jpg|jpeg|webp)')
    .pipe(newer('dist/assets/img/'))
    .pipe(cache(imagemin({ interlaced: true, }[
      webp({
        quality: 60,
      })
    ])))
    // .pipe(webp())
    .pipe(extReplace('.webp'))
    .pipe(dest('dist/assets/img/'))
    .pipe(browserSync.stream());
}

// PLACES FONT FILES IN THE DIST FOLDER
function copyFont() {
  log(chalk.red.bold('---------------COPYING FONTS INTO DIST FOLDER---------------'));
  return src([
    'src/assets/fonts/**/*',
  ])
    .pipe(dest('dist/assets/fonts'))
    .pipe(browserSync.stream());
}

// PLACES VIDEOS IN THE DIST FOLDER
function copyVideos() {
  log(chalk.red.bold('---------------COPYING VIDEOS INTO DIST FOLDER---------------'));
  return src([
    'src/assets/videos/*',
  ])
    .pipe(dest('dist/assets/videos/'))
    .pipe(browserSync.stream());
}

// PRETTIFY HTML FILES
function prettyHTML() {
  log(chalk.red.bold('---------------HTML PRETTIFY---------------'));
  return src('dist/**/*.html')
    .pipe(prettyHtml({
      indent_size: 4,
      indent_char: ' ',
      unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
    }))
    .pipe(dest('dist'));
}

// DELETE DIST FOLDER
function cleanDist(done) {
  log(chalk.red.bold('---------------REMOVING OLD FILES FROM DIST---------------'));
  del.sync('dist');
  return done();
}

// CREATE DOCS FOLDER FOR DEMO
function generateDocs() {
  log(chalk.red.bold('---------------CREATING DOCS---------------'));
  return src([
    'dist/**/*',
  ])
    .pipe(dest('docs'))
    .pipe(browserSync.stream());
}

// ACCESSIBILITY CHECK
function HTMLAccessibility() {
  return src('dist/**/*.html')
    .pipe(accessibility({
      force: true
    }))
    .on('error', console.log)
    .pipe(accessibility.report({
      reportType: 'txt'
    }))
    .pipe(rename({
      extname: '.txt'
    }))
    .pipe(dest('accessibility-reports'));
}

// ------------ PRODUCTION TASKS -------------

// CHANGE TO MINIFIED VERSIONS OF JS AND CSS
function renameSources() {
  log(chalk.red.bold('---------------RENAMING SOURCES---------------'));
  return src('dist/**/*.html')
    .pipe(htmlreplace({
      'dir': '<html lang="en" dir="ltr">',
      'js': 'assets/js/main.js',
      'css': 'assets/css/main.min.css'
    }))
    .pipe(dest('dist/'));
}
function renameSources_RTL() {
  log(chalk.red.bold('---------------RENAMING SOURCES RTL---------------'));
  return src('dist/**/*-rtl.html')
    .pipe(htmlreplace({
      'dir': '<html lang="ar" dir="rtl">',
      'js': 'assets/js/main.js',
      'css': 'assets/css/main.min-rtl.css'
    }))
    .pipe(dest('dist/'));
}

// CONCATINATE JS SCRIPTS
function concatScripts() {
  log(chalk.red.bold('---------------CONCATINATE SCRIPTS---------------'));
  return src([
    'dist/assets/vendor/js/jquery.js',
    'dist/assets/vendor/js/popper.js',
    'dist/assets/vendor/js/bootstrap.js',
    'src/assets/js/util/*',
    'src/assets/js/*'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('dist/assets/js'))
    .pipe(browserSync.stream());
}

// MINIFY SCRIPTS
function minifyScripts() {
  log(chalk.red.bold('---------------MINIFY SCRIPTS---------------'));
  return src(['dist/assets/vendor/js/*.js',
    '!dist/assets/vendor/js/*.min.js',
    '!dist/assets/vendor/js/aos.js'])
    .pipe(removeLog())
    .pipe(removeCode({
      production: true
    }))
    .pipe(uglify().on('error', function (err) {
      console.error(err);
      this.emit('end'); // Continue processing other files
    }))
    // .pipe(rename('main.min.js'))
    .pipe(dest('dist/assets/vendor/js/'));
}

// PURGE CSS
function purgeCSS() {
  log(chalk.red.bold('---------------PURGE CSS---------------'));
  return src([
    'dist/assets/css/main.css',
  ])
    .pipe(purgecss({
      content: ['dist/*.html']
    }))
    .pipe(dest('dist/assets/css'))
}


// MINIFY AND CONCAT CSS
function minifyCSS() {
  log(chalk.red.bold('---------------MINIFY CSS---------------'));
  return src([
    // 'dist/assets/vendor/css/**/*',
    'dist/assets/css/main.css'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write('./'))
    // .pipe(cssmin())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename('main.min.css'))
    .pipe(dest('dist/assets/css'))
}
function minifyCSS_RTL() {
  log(chalk.red.bold('---------------MINIFY CSS RTL---------------'));
  return src([
    // 'dist/assets/vendor/css/**/*',
    'dist/assets/css/main-rtl.css'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('main-rtl.css'))
    .pipe(sourcemaps.write('./'))
    // .pipe(cssmin())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename('main.min-rtl.css'))
    .pipe(dest('dist/assets/css'))

}


// CREATE DEVELOPER FOLDER FOR DEMO
function generateDevCSHTML() {

  log(chalk.blue.bold('------------------------START OF CUSTOM TASKS------------------------'));
  log(chalk.red.bold('---------------CREATING DEV FILES---------------'));
  // Read all HTML files in the src/pages directory

  return src(['dist/*.html', '!dist/*-rtl.html'])
    // Process each file
    .pipe(through2.obj(function (file, enc, callback) {
      // Read the contents of the file
      fs.readFile(file.path, enc, function (err, content) {
        if (err) {
          callback(err);
          return;
        }
        var filename = path.basename(file.path);
        if (!EnglishResourceStructureByPage[filename]) {
          EnglishResourceStructureByPage[filename] = [];
          ArabicResourceStructureByPage[filename] = [];
        }
        // log(chalk.yellow.bold('***Loaded File: ' + filename + '***'));
        const $ = cheerio.load(content);
        // Show Error incase nested localize-me is found
        if ($('[localize-me] [localize-me]').length > 0) {
          log(chalk.red.bold('***Error Occured in file: ' + file.path + '***'));
          process.exit(0);
        }
        $('[localize-me]').each(function () {

          // Skip Sidemenu items if anything other than index.html
          if (filename != "index.html" && $(this).closest("#sidebar-left").length > 0) {
            return;
          }

          // If Tag has main text node
          // if($(this).contents()[0].nodeType == 3){
          //   if($(this).text().indexOf("||") >= 0){
          //     var Texts = $(this).text().split("||");
          //     var DumpText = [];
          //     var i=0;
          //     Texts.forEach(text => {
          //       var TempDumpResourceName = text.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
          //       var TempDumpResourceVar = `@SharedHtmlLocalizer["${text.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase()}"]`;
          //       var TempDumpText = text.trim();

          //       EnglishResourceStructure[TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");;
          //       ArabicResourceStructure[TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");;

          //       DumpText.push({ResourceName:TempDumpResourceName,ResourceVar:TempDumpResourceVar,Text:TempDumpText.replace(/\s+/g, " ")});

          //       i++;
          //     });
          //     var j = 0;
          //     var DumpString = [];
          //     DumpText.forEach(Item =>{
          //       DumpString[j] = Item["ResourceVar"];
          //       j++;
          //     });
          //     $(this).replaceWith(DumpString.join(" || "));
          //   }
          //   else{
          //     const textNode = $(this);
          //     const originalText = textNode.text();
          //     var ResourceVar = textNode.text().replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
          //     textNode.replaceWith(`@SharedHtmlLocalizer["${ResourceVar}"]`);
          //     EnglishResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");;
          //     ArabicResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");;
          //   }
          // }
          // content = $.html();


          // Still should traverse and find child nodes
          // If its children have child nodes
          if ($(this).find("*").length > 0) {
            if ($(this).contents()[0].nodeType == 3) {
              // Check for Hidden Stuff.
              if ($($(this).contents()[0]).text().replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase() != "") {
                if ($($(this).contents()[0]).text().indexOf("||") >= 0) {
                  var Texts = $($(this).contents()[0]).text().split("||");
                  var DumpText = [];
                  var i = 0;
                  Texts.forEach(text => {
                    var TempDumpResourceName = text.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                    var TempDumpResourceVar = `@SharedHtmlLocalizer["${text.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase()}"]`;
                    var TempDumpText = text.trim();

                    EnglishResourceStructure[TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");
                    ArabicResourceStructure[TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");

                    if (!EnglishResourceStructureByPage[filename][TempDumpResourceName]) {
                      EnglishResourceStructureByPage[filename][TempDumpResourceName] = "";
                      ArabicResourceStructureByPage[filename][TempDumpResourceName] = "";
                    }
                    EnglishResourceStructureByPage[filename][TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");
                    ArabicResourceStructureByPage[filename][TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");

                    DumpText.push({ ResourceName: TempDumpResourceName, ResourceVar: TempDumpResourceVar, Text: TempDumpText.replace(/\s+/g, " ") });

                    i++;
                  });
                  var j = 0;
                  var DumpString = [];
                  DumpText.forEach(Item => {
                    DumpString[j] = Item["ResourceVar"];
                    j++;
                  });
                  $($(this).contents()[0]).replaceWith(DumpString.join(" || "));
                }
                else {
                  const textNode = $($(this).contents()[0]);
                  const originalText = textNode.text();
                  var ResourceVar = textNode.text().replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                  textNode.replaceWith(`@SharedHtmlLocalizer["${ResourceVar}"]`);
                  EnglishResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                  ArabicResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");

                  if (!EnglishResourceStructureByPage[filename][ResourceVar]) {
                    EnglishResourceStructureByPage[filename][ResourceVar] = "";
                    ArabicResourceStructureByPage[filename][ResourceVar] = "";
                  }
                  EnglishResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                  ArabicResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                }
              }
            }
            // For Placeholders
            if ($(this).attr("placeholder")) {
              // console.log($(this).attr("placeholder"));
              // console.log("Ran 1");

              var ResourceVar = $(this).attr("placeholder").replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
              var originalText = $(this).attr("placeholder");

              $(this).attr("placeholder", `@SharedHtmlLocalizer["${ResourceVar}"]`);
              EnglishResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");
              ArabicResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");

              if (!EnglishResourceStructureByPage[filename][ResourceVar]) {
                EnglishResourceStructureByPage[filename][ResourceVar] = "";
                ArabicResourceStructureByPage[filename][ResourceVar] = "";
              }
              EnglishResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
              ArabicResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");

            }
            // For Tooltips
            if ($(this).attr("data-bs-original-title")) {
              var ResourceVar = $(this).attr("data-bs-original-title").replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
              var originalText = $(this).attr("data-bs-original-title");

              $(this).attr("data-bs-original-title", `@SharedHtmlLocalizer["${ResourceVar}"]`);
              $(this).attr("aria-label", `@SharedHtmlLocalizer["${ResourceVar}"]`);
              $(this).attr("title", `@SharedHtmlLocalizer["${ResourceVar}"]`);

              EnglishResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");
              ArabicResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");

              if (!EnglishResourceStructureByPage[filename][ResourceVar]) {
                EnglishResourceStructureByPage[filename][ResourceVar] = "";
                ArabicResourceStructureByPage[filename][ResourceVar] = "";
              }
              EnglishResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
              ArabicResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
            }
            $(this).find("*").each(function () {
              // For Placeholders
              if ($(this).attr("placeholder")) {
                // console.log($(this).attr("placeholder"));
                // console.log("Ran 2");

                var ResourceVar = $(this).attr("placeholder").replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                var originalText = $(this).attr("placeholder");

                $(this).attr("placeholder", `@SharedHtmlLocalizer["${ResourceVar}"]`);
                EnglishResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                ArabicResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");

                if (!EnglishResourceStructureByPage[filename][ResourceVar]) {
                  EnglishResourceStructureByPage[filename][ResourceVar] = "";
                  ArabicResourceStructureByPage[filename][ResourceVar] = "";
                }
                EnglishResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                ArabicResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
              }
              // For Tooltips
              if ($(this).attr("data-bs-original-title")) {
                var ResourceVar = $(this).attr("data-bs-original-title").replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                var originalText = $(this).attr("data-bs-original-title");

                $(this).attr("data-bs-original-title", `@SharedHtmlLocalizer["${ResourceVar}"]`);
                $(this).attr("aria-label", `@SharedHtmlLocalizer["${ResourceVar}"]`);
                $(this).attr("title", `@SharedHtmlLocalizer["${ResourceVar}"]`);

                EnglishResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                ArabicResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");

                if (!EnglishResourceStructureByPage[filename][ResourceVar]) {
                  EnglishResourceStructureByPage[filename][ResourceVar] = "";
                  ArabicResourceStructureByPage[filename][ResourceVar] = "";
                }
                EnglishResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                ArabicResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
              }
            });
            $(this).find("*").contents().each(function () {
              if (this.type === 'text') {
                if ($(this).text().trim() != "") {
                  if ($(this).text().indexOf("||") >= 0) {
                    var Texts = $(this).text().split("||");
                    var DumpText = [];
                    var i = 0;
                    Texts.forEach(text => {
                      var TempDumpResourceName = text.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                      var TempDumpResourceVar = `@SharedHtmlLocalizer["${text.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase()}"]`;
                      var TempDumpText = text.trim();

                      EnglishResourceStructure[TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");
                      ArabicResourceStructure[TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");

                      if (!EnglishResourceStructureByPage[filename][TempDumpResourceName]) {
                        EnglishResourceStructureByPage[filename][TempDumpResourceName] = "";
                        ArabicResourceStructureByPage[filename][TempDumpResourceName] = "";
                      }
                      EnglishResourceStructureByPage[filename][TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");
                      ArabicResourceStructureByPage[filename][TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");

                      DumpText.push({ ResourceName: TempDumpResourceName, ResourceVar: TempDumpResourceVar, Text: TempDumpText.replace(/\s+/g, " ") });

                      i++;
                    });
                    var j = 0;
                    var DumpString = [];
                    DumpText.forEach(Item => {
                      DumpString[j] = Item["ResourceVar"];
                      j++;
                    });
                    $(this).replaceWith(DumpString.join(" || "));
                  }
                  else {
                    const textNode = $(this);
                    const originalText = textNode.text();
                    var ResourceVar = textNode.text().replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                    textNode.replaceWith(`@SharedHtmlLocalizer["${ResourceVar}"]`);
                    EnglishResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                    ArabicResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");

                    if (!EnglishResourceStructureByPage[filename][ResourceVar]) {
                      EnglishResourceStructureByPage[filename][ResourceVar] = "";
                      ArabicResourceStructureByPage[filename][ResourceVar] = "";
                    }
                    EnglishResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                    ArabicResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                  }
                }
              }
            });
          }
          else {
            $(this).contents().each(function () {
              // For Placeholders
              if ($(this).attr("placeholder")) {
                var ResourceVar = $(this).attr("placeholder").replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                var originalText = $(this).attr("placeholder");

                $(this).attr("placeholder", `@SharedHtmlLocalizer["${ResourceVar}"]`);
                EnglishResourceStructure[ResourceVar] = originalText.replace(/\s+/g, " ");
                ArabicResourceStructure[ResourceVar] = originalText.replace(/\s+/g, " ");

                if (!EnglishResourceStructureByPage[filename][ResourceVar]) {
                  EnglishResourceStructureByPage[filename][ResourceVar] = "";
                  ArabicResourceStructureByPage[filename][ResourceVar] = "";
                }
                EnglishResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                ArabicResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
              }
              // For Tooltips
              if ($(this).attr("data-bs-original-title")) {
                var ResourceVar = $(this).attr("data-bs-original-title").replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                var originalText = $(this).attr("data-bs-original-title");

                $(this).attr("data-bs-original-title", `@SharedHtmlLocalizer["${ResourceVar}"]`);
                $(this).attr("aria-label", `@SharedHtmlLocalizer["${ResourceVar}"]`);
                $(this).attr("title", `@SharedHtmlLocalizer["${ResourceVar}"]`);

                EnglishResourceStructure[ResourceVar] = originalText.replace(/\s+/g, " ");
                ArabicResourceStructure[ResourceVar] = originalText.replace(/\s+/g, " ");

                if (!EnglishResourceStructureByPage[filename][ResourceVar]) {
                  EnglishResourceStructureByPage[filename][ResourceVar] = "";
                  ArabicResourceStructureByPage[filename][ResourceVar] = "";
                }
                EnglishResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                ArabicResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
              }
              if (this.type === 'text') {
                if ($(this).text().trim() != "") {
                  if ($(this).text().indexOf("||") >= 0) {
                    var Texts = $(this).text().split("||");
                    var DumpText = [];
                    var i = 0;
                    Texts.forEach(text => {
                      var TempDumpResourceName = text.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                      var TempDumpResourceVar = `@SharedHtmlLocalizer["${text.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase()}"]`;
                      var TempDumpText = text.trim();

                      EnglishResourceStructure[TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");
                      ArabicResourceStructure[TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");

                      if (!EnglishResourceStructureByPage[filename][TempDumpResourceName]) {
                        EnglishResourceStructureByPage[filename][TempDumpResourceName] = "";
                        ArabicResourceStructureByPage[filename][TempDumpResourceName] = "";
                      }
                      EnglishResourceStructureByPage[filename][TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");
                      ArabicResourceStructureByPage[filename][TempDumpResourceName] = TempDumpText.trim().replace(/\s+/g, " ");

                      DumpText.push({ ResourceName: TempDumpResourceName, ResourceVar: TempDumpResourceVar, Text: TempDumpText.replace(/\s+/g, " ") });

                      i++;
                    });
                    var j = 0;
                    var DumpString = [];
                    DumpText.forEach(Item => {
                      DumpString[j] = Item["ResourceVar"];
                      j++;
                    });
                    $(this).replaceWith(DumpString.join(" || "));
                  }
                  else {
                    const textNode = $(this);
                    const originalText = textNode.text();
                    var ResourceVar = textNode.text().replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                    textNode.replaceWith(`@SharedHtmlLocalizer["${ResourceVar}"]`);
                    EnglishResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                    ArabicResourceStructure[ResourceVar] = originalText.trim().replace(/\s+/g, " ");

                    if (!EnglishResourceStructureByPage[filename][ResourceVar]) {
                      EnglishResourceStructureByPage[filename][ResourceVar] = "";
                      ArabicResourceStructureByPage[filename][ResourceVar] = "";
                    }
                    EnglishResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                    ArabicResourceStructureByPage[filename][ResourceVar] = originalText.trim().replace(/\s+/g, " ");
                  }
                }
              }
            });
          }
          $(this).removeAttr("localize-me");
        });

        // For force "" in already double quotes ""
        // example placeholder="@SharedHtmlLocalizer["some_placeholder"]"
        content = content.replace(/&quot;/g, '"').replaceAll('["{', "['{").replaceAll('}"]', "}]'");
        // content = content.replace(/&quot;/g, '"').replaceAll('["{', "['{").replaceAll('}"]', "}]'");

        // Start: Old Code. Based on Regex. Has Complexities dealing with unable to traverse text nodes
        // Convert the HTML content to a by wrapping all strings in "@[([" and "])]@"
        // content = content.replace(/<[^>]*localize-me[^>]*>([^<]+)<\/[^>]+>/g, function (match, p1) {
        //     var p2 = p1.trim().replace(/\s+/g, "_");
        //     p2 = p2.replace(/\(/g,"").replace(/\)/g,"").toLowerCase();
        //     var Multiple = p2.split("||");
        //     if(Multiple.length>1)
        //     {
        //       var i = 0;
        //       var DumpString = "";
        //       Multiple.forEach(element => {
        //         EnglishResourceStructure[element] = p1.split("||")[i];
        //         ArabicResourceStructure[element] = p1.split("||")[i];
        //         if(DumpString.length == 0)
        //           DumpString += `@SharedHtmlLocalizer["${element}"]`;
        //         else
        //           DumpString += ` || @SharedHtmlLocalizer["${element}"]`;

        //         i++;
        //       });
        //       return match.replace(p1, `@SharedHtmlLocalizer["${p2}"]`);
        //     }
        //     else{
        //       EnglishResourceStructure[p2] = p1;
        //       ArabicResourceStructure[p2] = p1;
        //     }
        //     return match.replace(p1, `@SharedHtmlLocalizer["${p2}"]`);
        // });
        // content = content.replace(/ localize-me/g, "");
        // End: Old Code. Based on Regex. Has Complexities dealing with unable to traverse text nodes

        // Replace the file contents with the processed content
        file.contents = Buffer.from(content, enc);
        // Emit the file for the next step in the pipeline
        callback(null, file);

        // console.log(EnglishResourceStructure);
        // console.log(ArabicResourceStructure);

      });
    }))
    .pipe(rename({ extname: ".cshtml" }))

    // Write the processed files to the dist/pages directory, keeping the same file names and directory structure
    .pipe(dest('Developer'));
}

// Remove Localize-me Attr
function removeLocalizer() {
  log(chalk.red.bold('---------------REMOVING LOCALIZE-ME ATTR---------------'));
  return src('dist/**/*.html')
    .pipe(through2.obj(function (file, enc, callback) {
      // Read the contents of the file
      fs.readFile(file.path, enc, function (err, content) {
        if (err) {
          callback(err);
          return;
        }
        // Remove the string "localize-me" from the file contents
        content = content.replace(/localize-me/g, "");

        // Replace the file contents with the modified content
        file.contents = Buffer.from(content, enc);
        // Emit the file for the next step in the pipeline
        callback(null, file);
      });
    }))
    .pipe(prettyHtml({
      indent_size: 4,
      indent_char: ' ',
      unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
    }))
    .pipe(dest('dist'));
}


function generateResxFilesEnglish() {
  log(chalk.red.bold('---------------GENERATING ENGLISH RESX FILES---------------'));
  var EnglishResourceStructureNET_Dump = "";
  var EnglishResourceStructureiOSSwift_Dump = "";
  var EnglishResourceStructureiOSLocalizable_Dump = "";
  var EnglishResourceStructureAndroid_Dump = "";
  var Count = 0;
  for (const key in EnglishResourceStructure) {
    EnglishResourceStructureNET_Dump += `<data name="${key}" xml:space="preserve">\n<value>${EnglishResourceStructure[key]}</value>\n</data>\n`;
    EnglishResourceStructureiOSSwift_Dump += `var ${key} = "${EnglishResourceStructure[key]}";\n`;
    EnglishResourceStructureiOSLocalizable_Dump += `"${key}" = "${ArabicResourceStructure[key]}";\n`;
    EnglishResourceStructureAndroid_Dump += `<string name="${key}">${EnglishResourceStructure[key]}</string>\n`;
    Count++;
  }
  // For iOS Function LoadAll
  EnglishResourceStructureiOSSwift_Dump += '\nfunc LoadAll(completion: @escaping (Int) -> ())  {\n';
  for (const key in EnglishResourceStructure) {
    EnglishResourceStructureiOSSwift_Dump += `self.${key} = getLocalizedText(key: "${key}");\n`;
  }
  EnglishResourceStructureiOSSwift_Dump += '}\n';
  log(chalk.yellow.bold("Dumping English Resources: " + Count));

  return src('src/resources/SharedResource.en.resx')
    .pipe(replace('{[CONTENT]}', EnglishResourceStructureNET_Dump))
    .pipe(dest('Developer/resources/NET/')),

    src('src/resources/AppText.swift')
      .pipe(replace('{[CONTENT]}', EnglishResourceStructureiOSSwift_Dump))
      .pipe(dest('Developer/resources/iOS/')),

    src('src/resources/Localizable.strings')
      .pipe(replace('{[CONTENT]}', EnglishResourceStructureiOSLocalizable_Dump))
      .pipe(dest('Developer/resources/iOS/en.lproj/')),

    src('src/resources/strings.xml')
      .pipe(replace('{[CONTENT]}', EnglishResourceStructureAndroid_Dump))
      .pipe(rename('strings.xml'))
      .pipe(dest('Developer/resources/Android/values_en/'));
}

function generateResxFilesArabic() {
  log(chalk.red.bold('---------------GENERATING ARABIC RESX FILES---------------'));

  var ArabicResourceStructureNET_Dump = "";
  var ArabicResourceStructureiOSSwift_Dump = "";
  var ArabicResourceStructureiOSLocalizable_Dump = "";
  var ArabicResourceStructureAndroid_Dump = "";
  var Count = 0;
  for (const key in ArabicResourceStructure) {
    ArabicResourceStructureNET_Dump += `<data name="${key}" xml:space="preserve">\n<value>${ArabicResourceStructure[key]}</value>\n</data>\n`;
    ArabicResourceStructureiOSSwift_Dump += `var ${key} = "${ArabicResourceStructure[key]}";\n`;
    ArabicResourceStructureiOSLocalizable_Dump += `"${key}" = "${ArabicResourceStructure[key]}";\n`;
    ArabicResourceStructureAndroid_Dump += `<string name="${key}">${ArabicResourceStructure[key]}</string>\n`;
    Count++;
  }
  // For iOS Function LoadAll
  ArabicResourceStructureiOSSwift_Dump += '\nfunc LoadAll(completion: @escaping (Int) -> ())  {';
  for (const key in ArabicResourceStructure) {
    ArabicResourceStructureiOSSwift_Dump += `self.${key} = getLocalizedText(key: "${key}");\n`;
  }
  ArabicResourceStructureiOSSwift_Dump += '}';
  log(chalk.yellow.bold("Dumping Arabic Resources: " + Count));

  return src('src/resources/SharedResource.ar.resx')
    .pipe(replace('{[CONTENT]}', ArabicResourceStructureNET_Dump))
    .pipe(dest('Developer/resources/NET/')),

    // src('src/resources/AppText.swift')
    // .pipe(replace('{[CONTENT]}', ArabicResourceStructureiOSSwift_Dump))
    // .pipe(dest('Developer/resources/iOS/')),

    src('src/resources/Localizable.strings')
      .pipe(replace('{[CONTENT]}', ArabicResourceStructureiOSLocalizable_Dump))
      .pipe(dest('Developer/resources/iOS/ar.lproj/')),

    src('src/resources/strings.xml')
      .pipe(replace('{[CONTENT]}', ArabicResourceStructureAndroid_Dump))
      .pipe(rename('strings.xml'))
      .pipe(dest('Developer/resources/Android/values_ar/'));
}

// DELETE DIST FOLDER
function cleanDeveloper(done) {
  log(chalk.red.bold('---------------REMOVING OLD FILES FROM DEVELOPER---------------'));
  del.sync('Developer');
  return done();
}

// DELETE DIST FOLDER
function TestFunctions(done) {
  log(chalk.red.bold('---------------Running Tests---------------'));
  console.log(wrapLocalizableStrings('<div localize-me><p><a href="javascript:;" class="test">Click Me!<span>Please</span></a></p></div>'));
  return done();
}
function wrapLocalizableStrings1(input) {
  const $ = cheerio.load(input);
  var Output = "";
  // $('[localize-me]').contents();
  console.log("Contents are:" + $($('[localize-me]').contents()).contents());
  $('[localize-me]').each(function () {
    $(this).children().each(function () {
      if ($(this).text() != "" && $(this).children().length == 0) {
        console.log($(this).text());
      }
      else {
        if ($(this).children().length != 0) {
          console.log($(this).clone().children().remove().end().text());
        }
      }
    });
  });
}

function autoTranslate(done) {
  log(chalk.red.bold('---------------FINDING TRANSLATIONS---------------'));
  var source_data = null;

  // Get Data from Source
  var data = fs.readFileSync("./translation/source/source.json", { encoding: 'utf8', flag: 'r' });
  source_data = JSON.parse(data);

  // Check if both are found, get to work
  if (source_data) {
    console.log("Source File Loaded");
    // Read all HTML files
    return src(['dist/*-rtl.html'])
      // Process each file
      .pipe(through2.obj(function (file, enc, callback) {
        // Read the contents of the file
        fs.readFile(file.path, enc, function (err, content) {
          if (err) {
            callback(err);
            return;
          }
          const $ = cheerio.load(content, { decodeEntities: false });
          // Show Error incase nested localize-me is found
          if ($('[localize-me] [localize-me]').length > 0) {
            log(chalk.red.bold('***Error Occured in file: ' + file.path + '***'));
            process.exit(0);
          }
          $('[localize-me]').each(function () {
            // Still should traverse and find child nodes
            // If its children have child nodes
            if ($(this).find("*").length > 0) {
              if ($(this).contents()[0].nodeType == 3) {
                // Check for Hidden Stuff.
                if ($($(this).contents()[0]).text().replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase() != "") {
                  if ($($(this).contents()[0]).text().indexOf("||") >= 0) {
                    var Texts = $($(this).contents()[0]).text().split("||");
                    var DumpText = [];
                    var i = 0;
                    Texts.forEach(text => {
                      var found = source_data.find(item => item.En.toLowerCase() === text.trim().toLowerCase());

                      var TempDumpResourceName = text.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                      var TempDumpResourceVar = "";
                      if (found) {
                        TempDumpResourceVar = found.Ar;
                      }
                      // If not found, Copy as is.
                      else {
                        // log("Not Found " + text.trim());
                        TempDumpResourceVar = text.trim();
                      }
                      var TempDumpText = text.trim();
                      DumpText.push({ ResourceName: TempDumpResourceName, ResourceVar: TempDumpResourceVar, Text: TempDumpText.replace(/\s+/g, " ") });

                      i++;
                    });
                    var j = 0;
                    var DumpString = [];
                    DumpText.forEach(Item => {
                      DumpString[j] = Item["ResourceVar"];
                      j++;
                    });
                    $($(this).contents()[0]).replaceWith(DumpString.join(" || "));
                  }
                  else {
                    const textNode = $($(this).contents()[0]);
                    const originalText = textNode.text();
                    var ResourceVar = "";

                    var found = source_data.find(item => item.En.toLowerCase() === originalText.trim().replace(/\s+/g, " ").toLowerCase());
                    if (found) {
                      ResourceVar = found.Ar;
                    }
                    // If not found, Copy as is.
                    else {
                      // log("Not Found " + originalText.trim().replace(/\s+/g, " "););
                      ResourceVar = originalText.trim().replace(/\s+/g, " ");
                    }
                    textNode.replaceWith(ResourceVar);
                  }
                }
              }
              // For Placeholders
              if ($(this).attr("placeholder")) {
                // console.log($(this).attr("placeholder"));
                // console.log("Ran 1");
                var originalText = $(this).attr("placeholder");

                var ResourceVar = "";
                var found = source_data.find(item => item.En.toLowerCase() === originalText.trim().replace(/\s+/g, " ").toLowerCase());
                if (found) {
                  ResourceVar = found.Ar;
                }
                // If not found, Copy as is.
                else {
                  // log("Not Found " + originalText.trim().replace(/\s+/g, " "););
                  ResourceVar = originalText.trim().replace(/\s+/g, " ");
                }

                $(this).attr("placeholder", ResourceVar);
              }
              // For Tooltips
              if ($(this).attr("data-bs-original-title")) {
                // var ResourceVar = $(this).attr("data-bs-original-title").replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                var originalText = $(this).attr("data-bs-original-title");

                var ResourceVar = "";
                var found = source_data.find(item => item.En.toLowerCase() === originalText.trim().replace(/\s+/g, " ").toLowerCase());
                if (found) {
                  ResourceVar = found.Ar;
                }
                // If not found, Copy as is.
                else {
                  // log("Not Found " + originalText.trim().replace(/\s+/g, " "););
                  ResourceVar = originalText.trim().replace(/\s+/g, " ");
                }

                $(this).attr("data-bs-original-title", ResourceVar);
                $(this).attr("aria-label", ResourceVar);
                $(this).attr("title", ResourceVar);
              }
              $(this).find("*").each(function () {
                // For Placeholders
                if ($(this).attr("placeholder")) {
                  // console.log($(this).attr("placeholder"));
                  // console.log("Ran 1");
                  var originalText = $(this).attr("placeholder");

                  var ResourceVar = "";
                  var found = source_data.find(item => item.En.toLowerCase() === originalText.trim().replace(/\s+/g, " ").toLowerCase());
                  if (found) {
                    ResourceVar = found.Ar;
                  }
                  // If not found, Copy as is.
                  else {
                    // log("Not Found " + originalText.trim().replace(/\s+/g, " "););
                    ResourceVar = originalText.trim().replace(/\s+/g, " ");
                  }

                  $(this).attr("placeholder", ResourceVar);
                }
                // For Tooltips
                if ($(this).attr("data-bs-original-title")) {
                  // var ResourceVar = $(this).attr("data-bs-original-title").replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                  var originalText = $(this).attr("data-bs-original-title");

                  var ResourceVar = "";
                  var found = source_data.find(item => item.En.toLowerCase() === originalText.trim().replace(/\s+/g, " ").toLowerCase());
                  if (found) {
                    ResourceVar = found.Ar;
                  }
                  // If not found, Copy as is.
                  else {
                    // log("Not Found " + originalText.trim().replace(/\s+/g, " "););
                    ResourceVar = originalText.trim().replace(/\s+/g, " ");
                  }

                  $(this).attr("data-bs-original-title", ResourceVar);
                  $(this).attr("aria-label", ResourceVar);
                  $(this).attr("title", ResourceVar);
                }
              });
              $(this).find("*").contents().each(function () {
                if (this.type === 'text') {
                  if ($(this).text().trim() != "") {
                    if ($(this).text().indexOf("||") >= 0) {
                      var Texts = $(this).text().split("||");
                      var DumpText = [];
                      var i = 0;
                      Texts.forEach(text => {
                        var found = source_data.find(item => item.En.toLowerCase() === text.trim().toLowerCase());

                        var TempDumpResourceName = text.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                        var TempDumpResourceVar = "";
                        if (found) {
                          TempDumpResourceVar = found.Ar;
                        }
                        // If not found, Copy as is.
                        else {
                          // log("Not Found " + text.trim());
                          TempDumpResourceVar = text.trim();
                        }
                        var TempDumpText = text.trim();
                        DumpText.push({ ResourceName: TempDumpResourceName, ResourceVar: TempDumpResourceVar, Text: TempDumpText.replace(/\s+/g, " ") });

                        i++;
                      });
                      var j = 0;
                      var DumpString = [];
                      DumpText.forEach(Item => {
                        DumpString[j] = Item["ResourceVar"];
                        j++;
                      });
                      $(this).replaceWith(DumpString.join(" || "));
                    }
                    else {
                      const textNode = $($(this));
                      const originalText = textNode.text();
                      var ResourceVar = "";

                      var found = source_data.find(item => item.En.toLowerCase() === originalText.trim().replace(/\s+/g, " ").toLowerCase());
                      if (found) {
                        ResourceVar = found.Ar;
                      }
                      // If not found, Copy as is.
                      else {
                        // log("Not Found " + originalText.trim().replace(/\s+/g, " "););
                        ResourceVar = originalText.trim().replace(/\s+/g, " ");
                      }
                      textNode.replaceWith(ResourceVar);
                    }
                  }
                }
              });
            }
            else {
              $(this).contents().each(function () {
                // For Placeholders
                if ($(this).attr("placeholder")) {
                  var ResourceVar = $(this).attr("placeholder").replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                  var originalText = $(this).attr("placeholder");

                  $(this).attr("placeholder", `@SharedHtmlLocalizer["${ResourceVar}"]`);
                  EnglishResourceStructure[ResourceVar] = originalText.replace(/\s+/g, " ");
                  ArabicResourceStructure[ResourceVar] = originalText.replace(/\s+/g, " ");
                }
                // For Tooltips
                if ($(this).attr("data-bs-original-title")) {
                  var ResourceVar = $(this).attr("data-bs-original-title").replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                  var originalText = $(this).attr("data-bs-original-title");

                  $(this).attr("data-bs-original-title", `@SharedHtmlLocalizer["${ResourceVar}"]`);
                  $(this).attr("aria-label", `@SharedHtmlLocalizer["${ResourceVar}"]`);
                  $(this).attr("title", `@SharedHtmlLocalizer["${ResourceVar}"]`);

                  EnglishResourceStructure[ResourceVar] = originalText.replace(/\s+/g, " ");
                  ArabicResourceStructure[ResourceVar] = originalText.replace(/\s+/g, " ");
                }
                if (this.type === 'text') {
                  if ($(this).text().trim() != "") {
                    if ($(this).text().indexOf("||") >= 0) {
                      var Texts = $(this).text().split("||");
                      var DumpText = [];
                      var i = 0;
                      Texts.forEach(text => {
                        var found = source_data.find(item => item.En.toLowerCase() === text.trim().toLowerCase());

                        var TempDumpResourceName = text.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, "_").toLowerCase();
                        var TempDumpResourceVar = "";
                        if (found) {
                          TempDumpResourceVar = found.Ar;
                        }
                        // If not found, Copy as is.
                        else {
                          // log("Not Found " + text.trim());
                          TempDumpResourceVar = text.trim();
                        }
                        var TempDumpText = text.trim();
                        DumpText.push({ ResourceName: TempDumpResourceName, ResourceVar: TempDumpResourceVar, Text: TempDumpText.replace(/\s+/g, " ") });

                        i++;
                      });
                      var j = 0;
                      var DumpString = [];
                      DumpText.forEach(Item => {
                        DumpString[j] = Item["ResourceVar"];
                        j++;
                      });
                      $(this).replaceWith(DumpString.join(" || "));
                    }
                    else {
                      const textNode = $($(this));
                      const originalText = textNode.text();
                      var ResourceVar = "";

                      var found = source_data.find(item => item.En.toLowerCase() === originalText.trim().replace(/\s+/g, " ").toLowerCase());
                      if (found) {
                        ResourceVar = found.Ar;
                      }
                      // If not found, Copy as is.
                      else {
                        // log("Not Found " + originalText.trim().replace(/\s+/g, " "););
                        ResourceVar = originalText.trim().replace(/\s+/g, " ");
                      }
                      textNode.replaceWith(ResourceVar);
                    }
                  }
                }
              });
            }
            $(this).removeAttr("localize-me");
          });

          content = $.html();
          // For force "" in already double quotes ""
          // example placeholder="@SharedHtmlLocalizer["some_placeholder"]"
          content = content.replace(/&quot;/g, '"').replaceAll('"[{', "'[{").replaceAll('}]"', "}]'");
          // Replace the file contents with the processed content
          file.contents = Buffer.from(content, enc);
          // Emit the file for the next step in the pipeline
          callback(null, file);
        });
      }))
      // .pipe(rename({extname: ".html-done" }))
      // Write the processed files to the dist/pages directory, keeping the same file names and directory structure
      .pipe(dest('dist'));
  }
  // If either of the Streams have returned null
  else {
    console.log("Error Encountered");
    return done();
  }
}

const Data = [
  { Name: "about_us", English: "About Us", Arabic: "معلومات عنا" },
  { Name: "home", English: "Home", Arabic: "الصفحة الرئيسية" },
  { Name: "contact_us", English: "Contact Us", Arabic: "اتصل بنا" },
  // ...
];

function generateExcel() {
  const workbook = new Excel.Workbook();
  const sheet_workspace = workbook.addWorksheet('Workspace');
  const sheet_with_pagename_workspace = workbook.addWorksheet('Workspace With Page names');
  const iOS_workspace = workbook.addWorksheet('iOS Resource Generator');
  const android_workspace = workbook.addWorksheet('Android Resource Generator');
  const net_workspace = workbook.addWorksheet('.NET Resource Generator');

  const options = {
    selectLockedCells: true,
    formatCells: true,
    formatColumns: true,
    formatRows: true,
    insertColumns: true,
    insertRows: true,
    insertHyperlinks: true,
    deleteColumns: true,
    deleteRows: true,
    sort: true,
    autoFilter: true,
    pivotTables: true,
    scenarios: true,
  };

  var count = 0;

  var source_data = null;

  // Get Data from Source
  var data = fs.readFileSync("./translation/source/source.json", { encoding: 'utf8', flag: 'r' });
  source_data = JSON.parse(data);

  // Check if both are found, get to work
  if (source_data) {

    sheet_workspace.columns = [
      { header: 'Name', key: 'Name', width: 20 },
      { header: 'English', key: 'English', width: 30 },
      { header: 'Arabic', key: 'Arabic', width: 30 },
    ];

    sheet_with_pagename_workspace.columns = [
      { header: 'Name', key: 'Name', width: 20 },
      { header: 'English', key: 'English', width: 30 },
      { header: 'Arabic', key: 'Arabic', width: 30 },
      // { header: 'Page Name', key: 'PageName', width: 30 },
    ];

    iOS_workspace.columns = [
      { header: 'English', key: 'English', width: 30 },
      { header: 'Arabic', key: 'Arabic', width: 30 },
    ];

    android_workspace.columns = [
      { header: 'English', key: 'English', width: 30 },
      { header: 'Arabic', key: 'Arabic', width: 30 },
    ];

    net_workspace.columns = [
      { header: 'English', key: 'English', width: 30 },
      { header: 'Arabic', key: 'Arabic', width: 30 },
    ];
    // console.log(EnglishResourceStructureByPage);
    for (const key in EnglishResourceStructureByPage) {
      // log(chalk.yellow.bold('***Adding Empty cell: ' + key + '***'));
      sheet_with_pagename_workspace.addRow({
        Name: key,
        English: "",
        Arabic: "",
        // PageName: "",
      });
      // log(chalk.yellow.bold('***Merging cell: ' + key + ' @ ' + sheet_with_pagename_workspace.lastRow.number + '***'));
      // Get the last row in the sheet
      var lastRow = sheet_with_pagename_workspace.lastRow.number;
      // Merge cells from the first cell to the last cell in the last row
      sheet_with_pagename_workspace.mergeCells("A" + lastRow + ":C" + lastRow);
      var mergedCell = sheet_with_pagename_workspace.getCell("A" + lastRow);
      // Apply bold font
      mergedCell.font = { bold: true };
      mergedCell.alignment = { horizontal: "center" };
      // Increase font size
      mergedCell.font.size = mergedCell.font.size + 2;
      // Change background color
      mergedCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D3D3D3" } };
      // Add border
      mergedCell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } }
      };

      // log(chalk.yellow.bold('***Writing File: ' + key + '***'));
      for (const item in EnglishResourceStructureByPage[key]) {
        if (item != "") {
          // console.log("Finding: " + item);
          var found = source_data.find(x => x.En.toLowerCase() === EnglishResourceStructureByPage[key][item].trim().toLowerCase());
          if (found) {
            // console.log("Found: " + item);
            sheet_with_pagename_workspace.addRow({
              Name: item,
              English: EnglishResourceStructureByPage[key][item],
              Arabic: found.Ar,
            });
          }
          else {
            // console.log("Not Found: " + item);
            sheet_with_pagename_workspace.addRow({
              Name: item,
              English: EnglishResourceStructureByPage[key][item],
              Arabic: EnglishResourceStructureByPage[key][item],
            });
          }
        }
      }



    }


    for (const key in EnglishResourceStructure) {
      var found = source_data.find(item => item.En.toLowerCase() === EnglishResourceStructure[key].trim().toLowerCase());
      if (found) {
        sheet_workspace.addRow({
          Name: key,
          English: EnglishResourceStructure[key],
          Arabic: found.Ar,
        });
      }
      else {
        sheet_workspace.addRow({
          Name: key,
          English: EnglishResourceStructure[key],
          Arabic: EnglishResourceStructure[key],
        });
      }
      count++;
    }
  }

  for (let i = 0; i < count; i++) {
    iOS_workspace.addRow({
      English: { formula: '=IF(ISBLANK(Workspace!$A' + (i + 2) + '),"",CONCATENATE(CHAR(34),Workspace!$A' + (i + 2) + ',CHAR(34),"=",CHAR(34),Workspace!B' + (i + 2) + ',CHAR(34),";"))' },
      Arabic: { formula: '=IF(ISBLANK(Workspace!$A' + (i + 2) + '),"",CONCATENATE(CHAR(34),Workspace!$A' + (i + 2) + ',CHAR(34),"=",CHAR(34),Workspace!C' + (i + 2) + ',CHAR(34),";"))' },
    });
    android_workspace.addRow({
      English: { formula: '=IF(ISBLANK(Workspace!$A' + (i + 2) + ')," ",CONCATENATE("<string name=",CHAR(34),Workspace!$A' + (i + 2) + ',CHAR(34),">",Workspace!B' + (i + 2) + ',"</string>"))' },
      Arabic: { formula: '=IF(ISBLANK(Workspace!$A' + (i + 2) + ')," ",CONCATENATE("<string name=",CHAR(34),Workspace!$A' + (i + 2) + ',CHAR(34),">",Workspace!C' + (i + 2) + ',"</string>"))' },
    });
    net_workspace.addRow({
      English: { formula: '=if(isblank(Workspace!$A' + (i + 2) + '),"",CONCATENATE("<data name=",CHAR(34),Workspace!$A' + (i + 2) + ',CHAR(34)," xml:space=",CHAR(34),"preserve",CHAR(34),">",CHAR(10),"<value>",Workspace!B' + (i + 2) + ',"</value>",CHAR(10),"</data>"))' },
      Arabic: { formula: '=if(isblank(Workspace!$A' + (i + 2) + '),"",CONCATENATE("<data name=",CHAR(34),Workspace!$A' + (i + 2) + ',CHAR(34)," xml:space=",CHAR(34),"preserve",CHAR(34),">",CHAR(10),"<value>",Workspace!C' + (i + 2) + ',"</value>",CHAR(10),"</data>"))' },
    });
  }

  iOS_workspace.protect('mpp-design-team', options);
  android_workspace.protect('mpp-design-team', options);
  net_workspace.protect('mpp-design-team', options);

  return workbook.xlsx.writeFile('Developer/resources/Source.xlsx')
    .then(() => {
      console.log('Excel file has been created.');
    });
}

function updateHtmlImageSrc() {
  console.log("Replacing with Webp")
  return src('dist/*.html') // Source HTML files
    .pipe(replace(".png", ".webp"))
    .pipe(replace(".jpg", ".webp"))
    .pipe(replace(".jpeg", ".webp"))
    .pipe(dest('dist')); // Output the modified HTML files
}

function runLighthouse(done) {
  log(chalk.red.bold('---------------RUNNING LIGHTHOUSE---------------'));
  const timestamp = moment().format('YYYYMMDD-HHmmss');

  shell.task([
    `lighthouse http://localhost:3000 --preset=desktop --quiet --view=true --output-path=./Reports/report-desktop-${timestamp}.html`,
    `lighthouse http://localhost:3000 --form-factor=mobile --quiet --view=true --output-path=./Reports/report-mobile-${timestamp}.html`,
  ])();
  done();
}

// Define the critical CSS generation task
async function generateCriticalCSS() {
  const critical = await import('critical');

  return src('dist/*.html')
    .pipe(critical.stream({
      base: 'dist/',
      inline: false,
      css: ['dist/assets/css/main.css'],
    }))
    .pipe(rename({ extname: '.critical.css' }))  // Rename generated files
    .pipe(dest('dist/assets/crit-css/'));  // Save generated files
}

// DEVELOPMENT
// exports.development = series(cleanDist, copyFont, copyImages, compileHTML, compileSCSS, cssVendor, jsVendor, compileJS, resetPages, prettyHTML,  browserSyncInit, watchFiles);
exports.development = series(cleanDist, copyFont, copyFavicons, copyDownloads, copyImages, compressImages, copyVideos, compileHTML, compileSCSS, cssVendor, jsVendor, compileJS, minifyScripts, resetPages, updateHtmlImageSrc, prettyHTML, browserSyncInit, watchFiles);

exports.minifyCSS = series(minifyCSS);
exports.minifyJS = series(minifyScripts);
exports.report = series(runLighthouse);
exports.critcss = series(generateCriticalCSS);

// PRODUCTION
exports.production = series(cleanDist, copyFont, copyFavicons, copyDownloads, copyImages, compressImages, copyVideos, compileHTML, compileSCSS, cssVendor, minifyCSS, minifyCSS_RTL, jsVendor, compileJS, minifyScripts, renameSources_RTL, renameSources, prettyHTML, updateHtmlImageSrc, generateDocs, generateDevCSHTML, generateResxFilesEnglish, generateResxFilesArabic, generateExcel, autoTranslate, removeLocalizer, generateCriticalCSS, browserSyncInit, runLighthouse);
// exports.production = series(cleanDist, copyFont, copyImages, compileHTML, compileSCSS, cssVendor, minifyCSS, minifyCSS_RTL, jsVendor, compileJS, renameSources_RTL, renameSources, prettyHTML, generateDocs, browserSyncInit);
// exports.production = series(cleanDist, copyFont, copyImages, compileHTML, compileSCSS, cssVendor, purgeCSS, minifyCSS, jsVendor, concatScripts, minifyScripts, renameSources, prettyHTML, generateDocs, browserSyncInit);
// RUN ALL LINTERS
exports.lint = series(htmlLint, scssLint, jsLint);

// RUN ACCESSIBILITY CHECK
exports.a11y = HTMLAccessibility;
