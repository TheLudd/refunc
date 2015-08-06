var Stream = require('./stream')

/**
 * Merges a list of streams into one, with the ability to provide a
 * reducing function for each original stream, that combines the
 * values from the original stream with the current value of the new
 * stream.
 *
 * The streams and their reduce functions are provided in a list where
 * each element in the list should itself be a list of two elements.
 * The first is the stream and the second is the binary reduce function.
 *
 * @example
 * var add = function(a, b) { return a + b }
 * var subtract = function(a, b) { return a - b }
 * var s1 = Stream()
 * var s2 = Stream()
 * var s3 = reduceMerge(0, [
 *  [ s1, add ]
 *  [ s2, subtract ]
 * ])
 * s1.put(15)
 * s2.put(3)
 * s3.extract() // => 12
 *
 * @sig a -> [ [ Stream[b], (a, b -> a) ] ] -> Stream[a]
 *
 * @param {*} initial The initial value for the new stream
 * @param {Array} streamReductions The list of streams and reduce
 * functions
 * @returns {Stream} A new Stream
 * @function reduceMerge
 */
module.exports = function (initial, streamReductions) {
  var newStream = Stream()
  var current = initial
  streamReductions.forEach(function (pair) {
    var stream = pair[0]
    var reduceFn = pair[1]
    stream.subscribe(function (v) {
      current = reduceFn(current, v)
      newStream.put(current)
    })
  })
  return newStream
}
