module.exports = FiniteStream

function FiniteStream () {

  var fs = {}
  var subscribers = []
  var endFns = []

  fs.subscribe = function (fn, endFn) {
    subscribers.push(fn)
    endFns.push(endFn)
  }

  fs.put = function (val) {
    subscribers.forEach(function (fn) {
      fn(val)
    })
  }

  fs.end = function () {
    endFns.forEach(function (fn) {
      fn()
    })
  }

  fs.map = function (f, efn) {
    var newStream = FiniteStream()
    fs.subscribe(function(v) {
      newStream.put(f(v))
    }, efn)
    return newStream
  }

  return fs

}
