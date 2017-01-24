/* eslint-disable import/no-extraneous-dependencies */

import autoprefixer from 'gulp-autoprefixer';
import babel from 'rollup-plugin-babel';
import browserSync from 'browser-sync';
import bump from 'gulp-bump';
import clean from 'gulp-clean';
import concat from 'gulp-concat';
import eslint from 'gulp-eslint';
import flatten from 'gulp-flatten';
import fs from 'fs';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import gulpUtil from 'gulp-util';
import ignore from 'gulp-ignore';
import marked from 'gulp-marked';
import modify from 'gulp-modify';
import nano from 'gulp-cssnano';
import newer from 'gulp-newer';
import nodeResolve from 'rollup-plugin-node-resolve';
import notify from 'gulp-notify';
import optimize from 'gulp-optimize-js';
import path from 'path';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import runSequence from 'run-sequence';
import sass from 'gulp-sass';
import semver from 'semver';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import zip from 'gulp-zip';

import rollup from './scripts/gulp-rollup';

import * as config from './config.json';
import * as configLocal from './config.local.json';
import * as packageJson from './package.json';


// Flags
const production = gulpUtil.env.production;  // `--production`

// Start BrowserSync
const bs = browserSync.create(packageJson.name);

// Overwrite global with local settings
Object.assign(config, configLocal);

// Extend marked options
const renderer = new marked.marked.Renderer();

renderer.heading = (text, level) => {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

  return `
<h${level + 1} id="${escapedText}" class="smaller underlined anchored">
  <a href="${escapedText}" class="hidden-anchor">
    <svg class="icon">
      <use
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xlink:href="../assets/images/icons.svg#link"></use>
    </svg>
  </a>
  <span>${text}</span>
</h${level + 1}>
  `;
};

Object.assign(config.markedOptions, { renderer });

let wikiHtml = '';


/*
 * -----------------------------------------------------------------------------
 * Config & Helpers
 * -----------------------------------------------------------------------------
 */

// Make sure that we catch errors for every task
const gulpSrc = gulp.src;
gulp.src = (...args) => gulpSrc
  .apply(gulp, args)
  .pipe(plumber(function errHandler(error) {
    // Error Notification
    notify.onError({
      title: `Error: ${error.plugin}`,
      message: `${error.plugin} is complaining.`,
      sound: 'Funk'
    })(error);

    // Output an error message
    gulpUtil.log(
      gulpUtil.colors.red(
        `Error (${error.plugin}): ${error.message}`
      )
    );

    // Emit the end event, to properly end the task
    this.emit('end');
  }));

const getDirs = srcPath => fs.readdirSync(srcPath)
  .filter(file => fs.statSync(`${srcPath}/${file}`).isDirectory());

const getModules = (srcPath, _config) => getDirs(srcPath)
  .filter(module => _config[module])
  .map(module => `${srcPath}/${module}/index.js`);


/*
 * -----------------------------------------------------------------------------
 * Tasks
 * -----------------------------------------------------------------------------
 */

// Browser-sync task, only cares about compiled CSS
gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: config.dist
    }
  });
});


// Shorthand
gulp.task('bv', ['bump-version']);
gulp.task('bump-version', () => {
  let increment;

  if (gulpUtil.env.patch) {
    increment = 'patch';
  }

  if (gulpUtil.env.minor) {
    increment = 'minor';
  }

  if (gulpUtil.env.major) {
    increment = 'major';
  }

  return gulp.src(['./package.json'])
    .pipe(bump({
      version: semver.inc(packageJson.version, increment)
    }))
    .pipe(gulp.dest('./'));
});


// Cean
gulp.task('clean', () => gulp
  .src(config.dist, { read: false })
  .pipe(plumber())
  .pipe(clean())
);


// Docs
gulp.task('docs', () => gulp
  .src(`${config.dist}/${config.docs}/index.html`)
  .pipe(plumber())
  .pipe(modify({
    fileModifier: (file, contents) =>
      contents.replace('<!-- Wiki goes here -->', wikiHtml)
  }))
  .pipe(gulp.dest(`${config.dist}/${config.docs}`))
  .pipe(bs.reload({ stream: true }))
);


// Video
gulp.task('html', () => gulp
  .src(`${config.src}/**/*.html`)
  .pipe(plumber())
  .pipe(newer(config.dist))
  .pipe(gulp.dest(config.dist))
  .pipe(bs.reload({ stream: true }))
);


// Images
gulp.task('images', () => gulp
  .src(`${config.src}/${config.assets.images}/**/*.{jpg,png,svg}`)
  .pipe(plumber())
  .pipe(newer(`${config.dist}/${config.assets.images}`))
  .pipe(gulp.dest(`${config.dist}/${config.assets.images}`))
  .pipe(bs.reload({ stream: true }))
);


// Live reload sync on every screen connect to localhost
gulp.task('init-live-reload', () => {
  bs.init({
    server: {
      baseDir: config.dist
    },
    notify: false,
    snippetOptions: {
      ignorePaths: ['panel/**', 'site/accounts/**']
    }
  });
});


// JavaScript
gulp.task('js', () => gulp
  .src(
    getModules(`${config.src}/${config.assets.scripts}`, config.jsBundles),
    { read: false }
  )
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(rollup(file => ({
    banner: `/* Copyright ${packageJson.author}: ${config.jsBundles[
      path.basename(path.dirname(file.path))
    ].banner} */`,
    format: 'umd',
    globals: config.rollupGlobals,
    external: config.rollupExternals,
    moduleName: config.jsBundles[
      path.basename(path.dirname(file.path))
    ].name,
    plugins: [
      babel({
        babelrc: false,
        // The following unfortunately doesn't work:
        // exclude: 'node_modules/**',
        // include: [
        //   'node_modules/domtastic/**'
        // ],
        plugins: ['external-helpers'],
        presets: [[
          'es2015',
          {
            modules: false
          }
        ]]
      }),
      nodeResolve({
        jsnext: true,
        browser: true
      })
    ],
    sourceMap: !production
  })))
  .pipe(rename((bundlePath) => {
    /* eslint-disable no-param-reassign */
    bundlePath.basename = bundlePath.dirname;
    /* eslint-enable no-param-reassign */
    return bundlePath;
  }))
  .pipe(flatten())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(`${config.dist}/${config.assets.scripts}`))
  // Exclude everything when we are not in production mode.
  .pipe(
    gulpIf(
      !production,
      ignore.exclude('*')
    )
  )
  // Init source map
  .pipe(sourcemaps.init())
  // Unglify JavaScript if we start Gulp in production mode. Otherwise
  // concat files only.
  .pipe(
    uglify({
      preserveComments: 'license'
    })
  )
  // Append hash to file name in production mode for better cache control
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(`${config.dist}/${config.assets.scripts}`))
  // Include only JavaScript files
  .pipe(ignore.include('*.js'))
  // Optimize code for speed
  .pipe(optimize({ sourceMaps: true }))
  .pipe(gulp.dest(`${config.dist}/${config.assets.scripts}`))
  .pipe(bs.reload({ stream: true }))
);


// Copy over specific npm scripts
gulp.task('js-npm-scripts', () => gulp
  .src(config.thirdPartyScripts)
  .pipe(plumber())
  .pipe(flatten())
  .pipe(newer(`${config.dist}/${config.assets.scriptsThirdParty}`))
  .pipe(gulp.dest(`${config.dist}/${config.assets.scriptsThirdParty}`))
  .pipe(bs.reload({ stream: true }))
);


// Third party JS scripts
gulp.task('js-third-party', () => gulp
  .src(`${config.src}/${config.assets.scriptsThirdParty}/**/*.js`)
  .pipe(plumber())
  .pipe(newer(`${config.dist}/${config.assets.scriptsThirdParty}`))
  .pipe(gulp.dest(`${config.dist}/${config.assets.scriptsThirdParty}`))
  .pipe(bs.reload({ stream: true }))
);


// Lint Task
gulp.task('lint', () => gulp
  .src([
    `${config.src}/${config.assets.scripts}/**/*.js`,
    'scripts/**/*.js',
    'gulpfile.babel.js',
    `!${config.src}/${config.assets.scripts}/${config.eslintIgnore}/**/*.js`
  ])
  .pipe(plumber())
  .pipe(eslint({
    // Don't provide special eslint rules in production
    rules: production ? {} : config.eslintDevRules
  }))
  .pipe(eslint.format())
  .pipe(eslint.failOnError())
);


// SASS
gulp.task('sass', () => gulp
  .src(`${config.src}/${config.assets.styles}/index.scss`)
  .pipe(plumber())
  .pipe(flatten())
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest(`${config.dist}/${config.assets.styles}`))
  // Exclude everything when we are not in production mode.
  .pipe(
    gulpIf(
      !production,
      ignore.exclude('*')
    )
  )
  // Rename file
  .pipe(sourcemaps.init())
  // Add vendor prefixes in production mode
  .pipe(autoprefixer({
    browsers: config.browsers,
    cascade: true
  }))
  // Minify stylesheet in production mode
  .pipe(nano({
    discardComments: {
      removeAll: true
    },
    autoprefixer: false
  }))
  // Write sourcemap
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(`${config.dist}/${config.assets.styles}`))
  .pipe(bs.reload({ stream: true }))
);


// Video
gulp.task('videos', () => gulp
  .src(`${config.src}/${config.assets.videos}/**/*.{mp4,webm}`)
  .pipe(plumber())
  .pipe(newer(`${config.dist}/${config.assets.videos}`))
  .pipe(gulp.dest(`${config.dist}/${config.assets.videos}`))
  .pipe(bs.reload({ stream: true }))
);


// Watch Files For Changes
gulp.task('dev-watch', () => {
  gulp.watch(
    `${config.src}/${config.assets.scripts}/**/*.js`,
    ['js', 'lint']
  ).on('change', bs.reload);

  gulp.watch(
    `${config.src}/${config.assets.styles}/**/*.scss`,
    ['sass']
  ).on('change', bs.reload);

  gulp.watch(
    `${config.src}/${config.assets.images}/**/*`,
    ['images']
  ).on('change', bs.reload);

  gulp.watch(
    `${config.src}/${config.assets.files}/**/*`,
    ['files']
  ).on('change', bs.reload);

  gulp.watch(
    `${config.src}/${config.assets.videos}/**/*`,
    ['videos']
  ).on('change', bs.reload);

  gulp.watch(
    `${config.src}/**/*.html`,
    ['html']
  ).on('change', bs.reload);
});


// Parse wiki's markdown files
gulp.task('wiki', () => gulp
  .src(`${config.wiki}/**/*.md`)
  .pipe(plumber())
  .pipe(marked(config.markedOptions))
  .pipe(concat('index.html', { newLine: '\n' }))
  .pipe(modify({
    fileModifier: (file, contents) => {
      // This is bit weird setup but well only grad the content of the
      // concatenated wiki entries here in order to be able to paste them into
      // the docs HTML later.
      wikiHtml = contents;
      return contents;
    }
  }))
  .pipe(bs.reload({ stream: true }))
);


// Zip
gulp.task('zip', () => gulp
  .src(`${config.dist}/**/*`)
  .pipe(plumber())
  .pipe(zip('dist.zip'))
  .pipe(gulp.dest('.'))
);


/*
 * -----------------------------------------------------------------------------
 * Task compiltions
 * -----------------------------------------------------------------------------
 */


// Watch Files For Changes with live reload sync on every screen connect to
// localhost.
gulp.task('dev-watch-sync', (callback) => {
  runSequence('init-live-reload', 'dev-watch', callback);
});

gulp.task('build', (callback) => {
  runSequence(
    'clean',
    'lint',
    [
      'js',
      'js-third-party',
      'js-npm-scripts',
      'sass',
      'images',
      'videos',
      'prepare-html'
    ],
    callback
  );
});

gulp.task('compile', (callback) => {
  runSequence('build', 'zip', callback);
});

gulp.task('prepare-html', (callback) => {
  runSequence(['wiki', 'html'], 'docs', callback);
});

gulp.task('serve', (callback) => {
  runSequence('build', 'dev-watch-sync', callback);
});

gulp.task('default', ['build']);
