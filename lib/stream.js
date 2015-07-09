module.exports = Stream;

function Stream() {
  var val, subscribers = [];
  var s = function() {
    return val;
  };

  s.put = function(v) {
    val = v;
    subscribers.forEach(function(fn) {
      fn(v);
    });
  };

  s.subscribe = function(fn) {
    subscribers.push(fn);
  };

  s.map = function(fn) {
    var newVal = fn(val);
    var newStream = Stream.of(newVal);
    s.subscribe(function(v) {
      newStream.put(fn(v));
    });
    return newStream;
  };

  s.ap = function(s2) {
    var fn = s();
    var val = s2();
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
    return 1;
  };

  return s;

}

Stream.of = function(v) {
  var s = Stream();
  s.put(v);
  return s;
};

return Stream;

