require('babel-polyfill');

const path = require('path');
const gulp = require('gulp');
const jasmineBrowser = require('gulp-jasmine-browser');
const jasmine = require('gulp-jasmine');
const runSequence = require('run-sequence');
const TerminalReporter = require('jasmine-terminal-reporter');
const webpack = require('webpack-stream');
const webpackTestConfig = require('./spec/webpack.test.config');
const webpackConfig = require('./webpack.config');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const nodemon = require('nodemon');

function filterStack (stack) {
  const jasmineCorePath = require.resolve('jasmine-core').split(path.sep).slice(0, -1).join(path.sep);
  const superTestPath = require.resolve('supertest').split(path.sep).slice(0, -1).join(path.sep);
  const superAgentPath = require.resolve('superagent').split(path.sep).slice(0, -1).join(path.sep);
  return stack.split('\n').filter(function (stackLine) {
    return stackLine.indexOf(jasmineCorePath) === -1 && stackLine.indexOf(superTestPath) === -1
      && stackLine.indexOf(superAgentPath) === -1
  }).join('\n');
}
const terminalReporter = new TerminalReporter({
  showColors: true,
  includeStackTrace: true,
  stackFilter: function (stack) {
   return filterStack(stack)
  }
});

gulp.task('serverWatch', function () {
  nodemon({
    script: './server/utilities/runServer.js',
    ext: '.js',
    ignore: ['client/', 'public/']
  });
});

gulp.task('webpackWatch', function () {
  return bundleAssets(webpackConfig, {watch: true})
    .pipe(gulp.dest('public/'));
});

gulp.task('runDev', [
  'webpackWatch',
  'serverWatch'
]);

gulp.task('jasmine', function () {
  process.env.NODE_ENV = 'test';
  return bundleUnitTestAssets({watch: true}, false)
    .pipe(jasmineBrowser.specRunner({sourcemappedStacktrace: true}))
    .pipe(jasmineBrowser.server({port: 8888}));
});

gulp.task('unitSpecs', function () {
  process.env.NODE_ENV = 'test';
  return bundleUnitTestAssets({}, true)
    .pipe(jasmineBrowser.specRunner({console: true}))
    .pipe(jasmineBrowser.headless());
});

gulp.task('serverSpecs', function () {
  process.env.NODE_ENV = 'test';
  return gulp.src('spec/server/**/*Spec.js')
    .pipe(jasmine({reporter: terminalReporter}));
});

gulp.task('specs', function () {
  runSequence('unitSpecs', 'serverSpecs', function (err) {
    // avoids the cluttering error runSequence throws
    if (err) {
      process.exit(1)
    }
  });
});

function bundleUnitTestAssets (options, shouldKillProcess) {
  options = options || {};
  return gulp.src(['./spec/support/specHelper.js', './spec/client/**/*Spec.js'])
    .pipe(plumber())
    .pipe(webpack(Object.assign(webpackTestConfig, options)))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('Building test assets failed'), gutil.colors.red(err));
      if (shouldKillProcess) {
        process.exit(1);
      }
    });
}

function bundleAssets(config, options) {
  options = options || {};
  return gulp.src('./client/main.js')
    .pipe(plumber())
    .pipe(webpack(Object.assign(config, options)))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('Bundling test assets failed'), gutil.colors.red(err));
    });
}