module.exports = function(
  R
) {

  var callWith = R.flip(R.call)

  function Stream() {
    var events = [], subscribers = [];
    var s = function() {
      return events;
    };

    s.put = function(val) {
      events.push(val);
      R.forEach(callWith(val), subscribers);
    };

    s.subscribe = function(fn) {
      subscribers.push(fn);
    };

    s.map = function(fn) {
      var newStream = Stream();
      s.subscribe(R.compose(newStream.put, fn));
      return newStream;
    };

    return s;

  }


  return Stream;

};
