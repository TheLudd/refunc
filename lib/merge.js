var Stream = require('./stream');

/**
 * Merges a list of streams into one. All elements that are put into
 * the origial streams will be broadcasted through the new one.
 *
 * @example
 *
 * var s1 = Stream()
 * var s2 = Stream()
 * var s3 = merge([ s1, s2 ])
 * s1.put('foo');
 * s3.extract() // => 'foo'
 * s2.put('bar');
 * s3.extract() // => 'bar'
 *
 * @param {Array} streams The streams to merge
 * @returns {Stream} A new Stream
 * @function merge
 */
module.exports = function(streams) {
  var newStream = Stream();
  streams.forEach(function(s) {
    s.subscribe(newStream.put);
  });
  return newStream;
};
