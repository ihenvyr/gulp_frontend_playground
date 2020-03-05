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
const { src, dest, series, parallel, watch } = require("gulp");
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



// DOCS FILES
const docs = {
  css:    { src: "src/docs/scss/*.scss", dest: "build/docs/css" },
  html:   { src: "src/docs/*.html",      dest: "build/docs" },
  images: { src: "src/docs/images/**",   dest: "build/docs/images" },
  js:     { src: "src/docs/js/*.js",     dest: "build/docs/js" },
};

function docsCSS() {
  if (isDev) {
    return src(docs.css.src)
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss())
      .pipe(sourcemaps.write())
      .pipe(dest(docs.css.dest))
      .pipe(browserSync.stream());
  } else {
    return src(docs.css.src)
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss([cssnano()]))
      .pipe(dest(docs.css.dest))
      .pipe(browserSync.stream());
  }
}

function docsHTML() {
  return src(docs.html.src)
    .pipe(include())
    .pipe(dest(docs.html.dest))
    .pipe(browserSync.stream());
}

function docsImages() {
  return src(docs.images.src)
    .pipe(changed(docs.images.dest))
    .pipe(imagemin(imageminOptions))
    .pipe(dest(docs.images.dest))
    .pipe(resizer(imageResizeOptions))
    .pipe(rename({ suffix: "-thumb" }))
    .pipe(dest(docs.images.dest));
}

function docsJS() {
  if (isDev) {
    return src(docs.js.src)
      .pipe(dest(docs.js.dest))
      .pipe(browserSync.stream());
  } else {
    return src(docs.js.src)
      .pipe(uglify(uglifyOptions))
      .pipe(dest(docs.js.dest))
      .pipe(browserSync.stream());
  }
}



// ITEM FILES
const item = {
  css:    { src: "src/item/scss/*.scss",    dest: "build/item/css" },    // for itemCSS
  html:   { src: "src/item/*.html",         dest: "build/item" },
  images: { src: "src/item/images/**",      dest: "build/item/images" },
  js:     { src: "src/item/js/*.js",        dest: "build/item/js" },
  scss:   { src: "src/item/scss/**/*.scss", dest: "build/item/scss" },   // for itemSCSSSource
  vendor: { src: "src/item/vendor/**/*",    dest: "build/item/vendor" },
};

function itemCSS() {
  if (isDev) {
    return src(item.css.src)
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss())
      .pipe(sourcemaps.write())
      .pipe(dest(item.css.dest))
      .pipe(browserSync.stream());
  } else {
    return src(item.css.src)
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss())
      .pipe(dest(item.css.dest))
      .pipe(postcss([cssnano()]))
      .pipe(rename({ suffix: ".min" }))
      .pipe(dest(item.css.dest))
      .pipe(browserSync.stream());
  }
}

function itemHTML() {
  return src(item.html.src)
    .pipe(include())
    .pipe(dest(item.html.dest))
    .pipe(browserSync.stream());
}

function itemImages() {
  return src(item.images.src)
    .pipe(changed(item.images.dest))
    .pipe(imagemin(imageminOptions))
    .pipe(dest(item.images.dest));
    // ONLY WHEN NEEDED
    // .pipe(resizer(imageResizeOptions))
    // .pipe(rename({ suffix: "-thumb" }))
    // .pipe(dest(item.images.dest));
}

function itemJS() {
  if (isDev) {
    return src(item.js.src)
      .pipe(dest("build/item/js"))
      .pipe(browserSync.stream());
  } else {
    return src(item.js.src)
      .pipe(dest(item.js.dest))
      .pipe(uglify(uglifyOptions))
      .pipe(rename({ suffix: ".min" }))
      .pipe(dest(item.js.dest))
      .pipe(browserSync.stream());
  }
}

function itemSCSSSource() {
  return src(item.scss.src)
    .pipe(dest(item.scss.dest))
    .pipe(browserSync.stream());
}

function itemVendorSource() {
  return src(item.vendor.src)
    .pipe(changed(item.vendor.dest))
    .pipe(dest(item.vendor.dest))
    .pipe(browserSync.stream());
}



// DEMO FILES
const demo = {
  css:    { src: "src/demo/scss/*.scss", dest: "build/demo/css" },
  html:   { src: "src/demo/*.html",      dest: "build/demo" },
  images: { src: "src/demo/images/**",   dest: "build/demo/images" },
  js:     { src: "src/demo/js/*.js",     dest: "build/demo/js" },
};

function demoCSS() {
  if (isDev) {
    return src(demo.css.src)
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss())
      .pipe(sourcemaps.write())
      .pipe(dest(demo.css.dest))
      .pipe(browserSync.stream());
  } else {
    return src(demo.css.src)
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss([cssnano()]))
      .pipe(dest(demo.css.dest))
      .pipe(browserSync.stream());
  }
}

function demoHTML() {
  return src(demo.html.src)
    .pipe(include())
    .pipe(dest(demo.html.dest))
    .pipe(browserSync.stream());
}

function demoImages() {
  return src(demo.images.src)
    .pipe(changed(demo.images.dest))
    .pipe(imagemin(imageminOptions))
    .pipe(dest(demo.images.dest))
    .pipe(resizer(imageResizeOptions))
    .pipe(rename({ suffix: "-thumb" }))
    .pipe(dest(demo.images.dest));
}

function demoJS() {
  if (isDev) {
    return src(demo.js.src)
      .pipe(dest(demo.js.dest))
      .pipe(browserSync.stream());
  } else {
    return src(demo.js.src)
      .pipe(uglify(uglifyOptions))
      .pipe(dest(demo.js.dest))
      .pipe(browserSync.stream());
  }
}



// PUBLIC DEMO FILES
// obfuscate
const gs = require("gulp-selectors");
const gsProcessors = {
  css:  ["css"],       // run the css processor on .scss and .css files
  html: ["html"],      // run the html processor on .html files
  "js-strings": ["js"] // run the js-strings plugin on js files
};
const gsIgnores = {
  classes: ["fa", "fa-*"], // ignore these class selectors,
  ids: '*'                 // ignore all IDs
};

const rcs = require("gulp-rcs");
const rcsOptions = {
  exclude: ["fa", "fa-*"],
  prefix: "pre",
  suffix: "suf",
  replaceKeyframes: true,
};

const obfuscate = {
  src: [
    "build-public/item/css/*.css",
    "build-public/demo/css/*.css",

    "build-public/item/*.html",
    "build-public/demo/*.html",

    "build-public/item/js/item.js",
    "build-public/item/js/item.min.js",
    "build-public/demo/js/demo.js",
  ],
};

function publicBuild() {
  return src("build/**/*")
    .pipe(dest("build-public"))
}

function publicBuildObfuscate() {
  return src(obfuscate.src, { base: "./" })
    // .pipe(gs.run(gsProcessors, gsIgnores))
    // .pipe(gs.info())
    .pipe(rcs(rcsOptions))
    .pipe(dest("./"));
}



// BROWSER-SYNC
function sync(done) {
  browserSync.init({
    port: 4000,
    startPath: '/item/index.html',
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
  watch([docs.css.src, "src/docs/scss/partials/*.scss"], docsCSS);
  watch([docs.html.src, "src/docs/html/*.html"], docsHTML);
  watch([docs.images.src], docsImages);
  watch([docs.js.src], docsJS);

  watch([item.css.src, "src/item/scss/partials/*.scss"], itemCSS);
  watch([item.html.src], itemHTML);
  watch([item.images.src], itemImages);
  watch([item.vendor.src], itemVendorSource);
  watch([item.js.src], itemJS);

  watch([demo.css.src, "src/demo/scss/partials/*.scss"], demoCSS);
  watch([demo.html.src, "src/demo/html/*.html"], demoHTML);
  watch([demo.images.src], demoImages);
  watch([demo.js.src], demoJS);

  done();
}



// npm run dev
exports.dev = series(
  series(docsCSS, docsHTML, docsImages, docsJS),
  series(itemCSS, itemHTML, itemImages, itemJS),
  series(demoCSS, demoHTML, demoImages, demoJS),

  itemVendorSource,
  watchFiles,
  sync,
);

// npm run build
exports.build = series(
  series(docsCSS, docsHTML, docsImages, docsJS),
  series(itemCSS, itemHTML, itemImages, itemJS),
  series(demoCSS, demoHTML, demoImages, demoJS),

  // copy vendor source
  itemVendorSource,

  // generate public demo source
  series(publicBuild, publicBuildObfuscate),

  // copy scss source
  itemSCSSSource,
);
