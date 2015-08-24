var stream = require('./stream')

module.exports = function (predicate, originalStream) {
  var newStream = stream()

  function putIfPass (v) {
    if (predicate(v)) {
      newStream.put(v)
    }
  }

  originalStream.subscribe(putIfPass)
  originalStream.drain().forEach(putIfPass)

  return newStream
}
