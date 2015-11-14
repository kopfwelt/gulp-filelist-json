'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var defaults = require('lodash.defaults');
var pluginName = 'gulp-filelist-json';

module.exports = function (options) {
    var config = defaults(options || {}, {
        filename: 'filelist.json',
        verbose: false,
        compact: true
    });
    var entries = [];
    var firstFile;
    var msg;

    return through.obj(function (file, enc, callback) {
            //we handle null files (that have no contents), but not dirs
            if (file.isDirectory()) {
                return callback(null, file);
            }

            if (file.isStream()) {
                msg = 'Streaming not supported';
                return callback(new gutil.PluginError(pluginName), msg);
            }

            if (!firstFile) {
                firstFile = file;
            }
            var mtime = file.stat ? file.stat.mtime : null;
            var entry = file.relative;
            entries.push(entry)
            callback();
        },
        function (callback) {
            if (!firstFile) {
                return callback();
            }
            var space = config.compact ? '' : '  ';
            var contents = JSON.stringify(entries, null, space);
            if (options.verbose) {
                msg = 'Files in sitemap: ' + entries.length;
                gutil.log(pluginName, msg);
            }
            //create and push new vinyl file for sitemap
            this.push(new gutil.File({
                cwd: firstFile.cwd,
                base: firstFile.cwd,
                path: path.join(firstFile.cwd, config.filename),
                contents: new Buffer(contents)
            }));
            callback();
        });
};
