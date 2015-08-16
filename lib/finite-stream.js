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

  return fs

}
