const sass = require("gulp-sass");
const rename = require("gulp-rename");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const include = require("gulp-include");
const uglify = require("gulp-uglify");

const changed = require("gulp-changed");
const imagemin = require("gulp-imagemin");
const resizer = require('gulp-images-resizer');

const browserSync = require("browser-sync");
const { src, dest, series, watch } = require("gulp");
const isDev = process.env.NODE_ENV === "development";
const uglifyOptions = {
  compress: {
    drop_console: true,
  },
};
const imageminOptions = [
  imagemin.gifsicle({ interlaced: true }),
  imagemin.jpegtran({ progressive: true }),
  imagemin.optipng({ optimizationLevel: 5 }),
  imagemin.svgo({plugins: [{ removeViewBox: false, collapseGroups: true }]}),
];
const imageResizeOptions = {
  width : 520,
  height: 390,
  noCrop: true,
};

const config = {
  css:    { src: "src/scss/*.scss",    dest: "build/css" },    // for css
  html:   { src: "src/*.html",         dest: "build" },
  images: { src: "src/images/**",      dest: "build/images" },
  js:     { src: "src/js/*.js",        dest: "build/js" },
  scss:   { src: "src/scss/**/*.scss", dest: "build/scss" },   // for scss source
  vendor: { src: "src/vendor/**/*",    dest: "build/vendor" },
};

function css() {
  if (isDev) {
    return src(config.css.src)
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss())
      .pipe(sourcemaps.write())
      .pipe(dest(config.css.dest))
      .pipe(browserSync.stream());
  } else {
    return src(config.css.src)
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss())
      .pipe(dest(config.css.dest))
      .pipe(postcss([cssnano()]))
      .pipe(rename({ suffix: ".min" }))
      .pipe(dest(config.css.dest))
      .pipe(browserSync.stream());
  }
}

function html() {
  return src(config.html.src)
    .pipe(include())
    .pipe(dest(config.html.dest))
    .pipe(browserSync.stream());
}

function images() {
  return src(config.images.src)
    .pipe(changed(config.images.dest))
    .pipe(imagemin(imageminOptions))
    .pipe(dest(config.images.dest));
    // ONLY WHEN NEEDED
    // .pipe(resizer(imageResizeOptions))
    // .pipe(rename({ suffix: "-thumb" }))
    // .pipe(dest(config.images.dest));
}

function js() {
  if (isDev) {
    return src(config.js.src)
      .pipe(dest("build/js"))
      .pipe(browserSync.stream());
  } else {
    return src(config.js.src)
      .pipe(dest(config.js.dest))
      .pipe(uglify(uglifyOptions))
      .pipe(rename({ suffix: ".min" }))
      .pipe(dest(config.js.dest))
      .pipe(browserSync.stream());
  }
}

function scssSource() {
  return src(config.scss.src)
    .pipe(dest(config.scss.dest))
    .pipe(browserSync.stream());
}

function vendorSource() {
  return src(config.vendor.src)
    .pipe(changed(config.vendor.dest))
    .pipe(dest(config.vendor.dest))
    .pipe(browserSync.stream());
}

// BROWSER-SYNC
function sync(done) {
  browserSync.init({
    port: 4000,
    startPath: '/index.html',
    // enable or disable mirror actions or events to all others
    ghostMode: {
      clicks: false,
      scroll: false,
      location: false,
      forms: false,
    },
    server: {
      baseDir: "./build",
    },
  });

  done();
}

// WATCH FILES
function watchFiles(done) {
  watch([config.css.src, "src/scss/partials/*.scss"], css);
  watch([config.html.src], html);
  watch([config.images.src], images);
  watch([config.vendor.src], vendorSource);
  watch([config.js.src], js);
  done();
}

// npm run dev
exports.dev = series(
  series(css, html, images, js),
  vendorSource,
  watchFiles,
  sync,
);

// npm run build
exports.build = series(
  series(css, html, images, js),
  vendorSource,
  scssSource,
);
