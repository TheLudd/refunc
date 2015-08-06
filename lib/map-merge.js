var Stream = require('./stream')

/**
 * Merges a list of streams into one, with the ability to provide a map
 * function for each original stream, transforming the values that goes
 * into the new stream.
 *
 * The streams and their map functions are provided in a list where
 * each element in the list should itself be a list of two elements
 * The first is the stream and the second is the unary map function.
 *
 * @example
 * var double = function(x) { return x * 2 }
 * var increment = function(x) { return x + 1 }
 * var s1 = Stream()
 * var s2 = Stream()
 * var s3 = mapMerge([
 *  [ s1, double ]
 *  [ s2, increment ]
 * ])
 * s1.put(3)
 * s3.extract() // => 6
 * s2.put(20)
 * s3.extract() // => 21
 *
 * @sig [ [ Stream[a], (a -> b) ] ] -> Stream[b]
 * @param {Array} mappings The list of streams and map funcions
 * @returns {Stream} A new Stream
 * @function mapMerge
 */
module.exports = function (mappings) {
  var newStream = Stream()
  mappings.forEach(function (pair) {
    var stream = pair[0]
    var mapFn = pair[1]
    stream.subscribe(function (v) {
      newStream.put(mapFn(v))
    })
  })
  return newStream
}
