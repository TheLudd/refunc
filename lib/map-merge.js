var Stream = require('./stream');

module.exports = function(mappings) {
  var newStream = Stream();
  mappings.forEach(function(pair) {
    var stream = pair[0];
    var mapFn = pair[1];
    stream.subscribe(function(v) {
      newStream.put(mapFn(v));
    });
  });
  return newStream;
};
