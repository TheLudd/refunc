module.exports = Stream

/**
 * @class Stream
 *
 * @constructor
 *
 */
function Stream (initialEvents) {
  var subscribers = []
  var events = initialEvents || []
  var s = {}

  s.put = function (v) {
    events.push(v)
    subscribers.forEach(function (fn) {
      fn(v)
    })
  }

  /**
   * Subscribe to a stream with the provided callback. The callback will
   * be called for all elements added to the stream after subscription.
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

  /**
   * Get all events that have been put into this stream
   *
   * @function Stream#drain
   * @example Stream[a] => [a]
   */
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
    var newStream = Stream(events.map(fn))
    s.subscribe(function (v) {
      newStream.put(fn(v))
    })
    return newStream
  }

  /**
   * @function Stream#reduce
   * @example @Stream[b] => (a, b -> a) -> a -> Stream[a]
   */
  s.reduce = function (f, a) {
    var newStream = Stream.of(events.reduce(f, a))
    var newVal = newStream.extract()
    s.subscribe(function (v) {
      newVal = f(newVal, v)
      newStream.put(newVal)
    })
    return newStream
  }

  s.filter = function (predicate) {
    var newStream = Stream()
    s.subscribe(function (v) {
      if (predicate(v)) {
        newStream.put(v)
      }
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
  return Stream([v])
}
