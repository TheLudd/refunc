var Stream = require('./stream');

module.exports = function(initial, streamReductions) {
  var newStream = Stream();
  var current = initial;
  streamReductions.forEach(function(pair) {
    var stream = pair[0];
    var reduceFn = pair[1];
    stream.subscribe(function(v) {
      current = reduceFn(current, v);
      newStream.put(current);
    });
  });
  return newStream;
};
