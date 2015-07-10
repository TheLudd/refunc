module.exports = Stream;

function Stream() {
  var val, subscribers = [];
  var s = {};

  s.put = function(v) {
    val = v;
    subscribers.forEach(function(fn) {
      fn(v);
    });
  };

  s.subscribe = function(fn) {
    subscribers.push(fn);
  };

  s.unsubscribe = function(fn) {
    var index = subscribers.indexOf(fn);
    subscribers.splice(index, 1);
  };

  s.map = function(fn) {
    var newStream = Stream();
    s.subscribe(function(v) {
      newStream.put(fn(v));
    });
    return newStream;
  };

  s.ap = function(s2) {
    var fn = s.extract();
    var val = s2.extract();
    return Stream.of(fn(val));
  };

  s.chain = function(fn) {
    return fn(val);
  };

  s.reduce = function(f, a) {
    var newVal = f(a, val);
    var newStream = Stream.of(newVal);
    s.subscribe(function(v) {
      newVal = f(newVal, v)
      newStream.put(newVal);
    });
    return newStream;
  };

  s.extract = function() {
    return val;
  };

  return s;

}

Stream.of = function(v) {
  var s = Stream();
  s.put(v);
  return s;
};
