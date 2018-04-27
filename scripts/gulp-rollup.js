/* eslint-disable import/no-extraneous-dependencies */

/**
 * @usage
 *
 * gulp.src('app.js', {read: false})
 *     .pipe(rollup(options))
 *     .pipe(gulp.dest('dist'));
 */

import through from 'through2';
import gulpUtils from 'gulp-util';
import fs from 'fs';
import path from 'path';
import { rollup } from 'rollup';

const PLUGIN_NAME = 'gulp-rollup';

function unixStylePath(filePath) {
  return filePath.split(path.sep).join(path.sep);
}

function gulpRollup(_options_) {
  const options = _options_ || {};

  return through.obj((file, enc, callback) => {
    const _file = file;

    if (!_file.path) { callback(); }

    if (_file.isStream()) {
      callback(
        new gulpUtils.PluginError(PLUGIN_NAME, 'Streaming not supported')
      );
    }

    try {
      const stats = fs.lstatSync(_file.path);
      if (stats.isFile()) {
        let finalOptions = options;
        if (typeof options === 'function') {
          finalOptions = options(file);
        }
        finalOptions.input = _file.path;

        // Needed to adjust in order to include the actual dirname (not just
        // `.`) in order to properly rename modules.
        const fileBase = _file.base.slice(0, -1).split(path.sep);
        fileBase.pop();
        _file.base = fileBase.join(path.sep);

        rollup(finalOptions)
          .then(bundle => bundle.generate(finalOptions))
          .then(({ code, map }) => {
            _file.contents = Buffer.from(code);
            if (map) {
              // This makes sure the paths in the generated source map (file and
              // sources) are relative to _file.base:
              map.file = unixStylePath(_file.relative);
              map.sources = map.sources.map(
                fileName => unixStylePath(path.relative(_file.base, fileName))
              );
              _file.sourceMap = map;
            }
            callback(null, _file);
          }, (err) => {
            setImmediate(() => callback(
              new gulpUtils.PluginError(PLUGIN_NAME, err))
            );
          });
      }
    } catch (err) {
      callback(new gulpUtils.PluginError(PLUGIN_NAME, err));
    }
  }, function catchErr() {
    this.emit('end');
  });
}

export default gulpRollup;
