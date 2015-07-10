mapMerge = getDep 'lib/map-merge'
Stream = getDep 'lib/stream'

describe 'mapMerge', ->

  double = (nbr) -> nbr * 2
  toUpper = (str) -> str.toUpperCase()

  Given ->
    @s1 = Stream()
    @s2 = Stream()
  When ->
    @result = []
    @subject = mapMerge [
      [ @s1, double ]
      [ @s2, toUpper ]
    ]
    @subject.subscribe (v) => @result.push v
    @s1.put 10
    @s2.put 'foo'
  Then -> @result.should.deep.equal [ 20, 'FOO' ]
