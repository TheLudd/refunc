module.exports = function(
  R
) {

  var callWith = R.flip(R.call)

  function Stream() {
    var val, subscribers = [];
    var s = function() {
      return val;
    };

    s.put = function(v) {
      val = v;
      R.forEach(callWith(v), subscribers);
    };

    s.subscribe = function(fn) {
      subscribers.push(fn);
    };

    s.map = function(fn) {
      var newVal = fn(val);
      var newStream = Stream.of(newVal);
      s.subscribe(R.compose(newStream.put, fn));
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

    return s;

  }

  Stream.of = function(v) {
    var s = Stream();
    s.put(v);
    return s;
  };

  return Stream;

};
