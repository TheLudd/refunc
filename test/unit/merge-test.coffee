merge = getDep 'lib/merge'
Stream = getDep 'lib/stream'

describe 'merge', ->

  Given ->
    @s1 = Stream()
    @s2 = Stream()
  When ->
    @result = []
    @subject = merge([ @s1, @s2 ])
    @subject.subscribe (a) => @result.push a
    @s1.put(1)
    @s2.put(2)
  Then -> @result.should.deep.equal [ 1, 2 ]
