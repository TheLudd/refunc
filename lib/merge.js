var Stream = require('./stream');

module.exports = function(streams) {
  var newStream = Stream();
  streams.forEach(function(s) {
    s.subscribe(newStream.put);
  });
  return newStream;
};
