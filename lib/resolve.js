var each = require('async-each');
var fullpath = require('resolve');
var path = require('path');
var Promise = require('bluebird');

module.exports = function resolve(name, defaultDirs) {
  return new Promise(function(finish, nope) {
    var packageName = (
      name[0] === '@' ?
      name.slice(1) :
      'hmu-' + name
    );

    var dirs = defaultDirs || [];
    if (process.env.NODE_PATH) {
      dirs = dirs.concat(process.env.NODE_PATH.split(path.delimiter));
    } else {
      dirs.push(path.join(__dirname, '../..'));

      if (process.platform === 'win32') {
        dirs.push(path.join(process.env.APPDATA, 'npm/node_modules'));
      } else {
        dirs.push('/usr/lib/node_modules');
      }
    }

    each(dirs, function(dir, next) {
      fullpath(packageName, {basedir: dir}, function(err, file) {
        next(null, !err && file ? file : null);
      });
    }, function(err, res) {
      var files = res.filter(a => a);
      if (!err && files.length) {
        finish(files[0]);
      } else {
        nope(false);
      }
    });
  });
};
