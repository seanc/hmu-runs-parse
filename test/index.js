var parse = require('../lib');
var test = require('ava');

parse('gh foo, npm bar')
.then(function(res) {
  console.log(res);
});

test('multiple plugins with same input', function(t) {
  parse('gh~npm foobar')
  .then(function(res) {
    var expected = [
      {
        plugin: function gh() {},
        input: ['foobar'],
        options: {
          _: ['foobar']
        }
      },
      {
        plugin: function npmPlugin() {},
        input: ['foobar'],
        options: {
          _: ['foobar']
        }
      }
    ];
    t.deepEquals(res, expected);
  });
});

test('multiple plugins with different input', function(t) {
  parse('gh foo, npm bar')
  .then(function(res) {
    var expected = [
      {
        plugin: function gh() {},
        input: ['foo'],
        options: {
          _: ['foo']
        }
      },
      {
        plugin: function npmPlugin() {},
        input: ['bar'],
        options: {
          _: ['bar']
        }
      }
    ];
    t.deepEquals(res, expected);
  });
});
