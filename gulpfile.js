const projectFolder = "build";
const sourceFolder = "src";

// Ключ - отдельная html страница в итоговом проекте
// свойства - дирректории где находятся файлы необходимые конкретной странице
const pagesSrc = {
    index: {
        html: sourceFolder + "/html/index/index.html",
        img: sourceFolder + "/html/index/img/*"
    },
    photo: {
        html: sourceFolder + "/html/photo/photo.html",
        img: sourceFolder + "/html/photo/img/*"
    }
}

const path = {
    build: {
        html: projectFolder + "/",
        css: projectFolder + "/css/",
        js: projectFolder + "/js/",
        img: projectFolder + "/img/",
        fonts: projectFolder + "/fonts/"
    },
    src: {
        css: sourceFolder + "/scss/style.scss",
        js: sourceFolder + "/js/",
        fonts: sourceFolder + "/fonts/*.ttf"
    },
    watch: {
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/**/*.scss",
        js: sourceFolder + "/js/**/*.js",
        img: sourceFolder + "/img/*"
    },

    clean: "./" + projectFolder + "/"
}

function allPagesSrc(source) {
    return Object.keys(pagesSrc).map(el => pagesSrc[el][source])
}

const {src, dest} = require("gulp"),
    gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    scss = require("gulp-sass"),
    concat = require('gulp-concat'),
    autoprefixer = require("autoprefixer"),
    postcss = require("gulp-postcss");

function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + projectFolder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src([...allPagesSrc("html"), "!/**/_*.html"])
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

// для добавления файла js - добавь его в массив
function js() {
    return src([
        path.src.js + 'script.js'
    ])
        .pipe(concat("script.js"))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function clean() {
    return del(path.clean)
}

// изображения копируются в дирректорию path.build.img
// только если они находятся непосредственно в path.src.img
// при этом копируются только при перезапуске билда проекта
// watchFiles для вставки новых файлов не работает!!!
function img() {
    return src(allPagesSrc("img"))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(scss({
            outputStyle: "expanded"
        }))
        .pipe(postcss([
            autoprefixer()
          ]))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], img)
}

const build = gulp.series(clean, gulp.parallel(js, css, html, img));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;