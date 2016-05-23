var list = require('cli-list');
var minimist = require('minimist');
var each = require('async-each');
var resolve = require('./resolve');

module.exports = function(body) {
  if (!Array.isArray(body)) {
    body = body.split(' ') || [];
  }
  var opts = minimist(body);
  var argv = opts._;

  var runs = [];
  return new Promise(function(resv, reject) {
    each(list(argv), function map(item, next) {
      var names = item[0].split('~');
      var options = minimist(item.slice(1));
      var input = options._;

      each(names, function(name, subNext) {
        resolve(name).then(function resolve(path) {
          runs.push({
            plugin: require(path),
            input: input,
            options: options
          });
          subNext(null, null);
        }, reject.bind(name));
      }, next);
    }, function() {
      resv(runs);
    });
  });
};
