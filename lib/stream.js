module.exports = Stream

/**
 * @class Stream
 *
 * @constructor
 *
 */
function Stream () {
  var subscribers = []
  var events = []
  var s = {}

  s.put = function (v) {
    events.push(v)
    subscribers.forEach(function (fn) {
      fn(v)
    })
  }

  /**
   * Subscribe to a stream with the provided callback. The callback will
   * be called with all elements added to the stream after subscription.
   *
   * @function Stream#subscribe
   * @param {Function} fn The callback for items added to the stream
   * @example Stream[a] => f -> Void
   */
  s.subscribe = function (fn) {
    subscribers.push(fn)
  }

  /**
   * Cancel subscription of the stream. The callback will no longer be
   * called when new elements are added to the stream.
   *
   * @function Stream#unsubscribe
   * @example Stream[a] => f -> Void
   */
  s.unsubscribe = function (fn) {
    var index = subscribers.indexOf(fn)
    subscribers.splice(index, 1)
  }

  s.drain = function () {
    return events
  }

  /**
   * @function Stream#map
   * @sig @Stream[a] => (a -> b) -> Stream[b]
   *
   * @example
   *   var toUpper = function(str) {
   *     return str.toUpperCase()
   *   }
   *   var s1 = Stream()
   *   var s2 = s1.map(toUpper)
   *   s1.put('foo')
   *   s2.extract() //=> 'FOO'
   */
  s.map = function (fn) {
    var newStream = Stream()
    s.subscribe(function (v) {
      newStream.put(fn(v))
    })
    return newStream
  }

  s.ap = function (s2) {
    var fn = s.extract()
    var val = s2.extract()
    return Stream.of(fn(val))
  }

  /**
   * @sig @Stream[a] => (a -> Stream[b]) -> Stream[b]
   */
  s.chain = function (fn) {
    return fn(s.extract())
  }

  /**
   * @function Stream#reduce
   * @example @Stream[b] => (a, b -> a) -> a -> Stream[a]
   */
  s.reduce = function (f, a) {
    var newVal = f(a, s.extract())
    var newStream = Stream.of(newVal)
    s.subscribe(function (v) {
      newVal = f(newVal, v)
      newStream.put(newVal)
    })
    return newStream
  }

  s.extract = function () {
    return events[ events.length - 1 ]
  }

  return s

}

/**
 * @example (a -> Stream[a])
 * @memberof Stream
 */
Stream.of = function (v) {
  var s = Stream()
  s.put(v)
  return s
}
