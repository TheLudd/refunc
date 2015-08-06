reduceMerge = getDep 'lib/reduce-merge'
Stream = getDep 'lib/stream'

describe 'reduceMerge', ->

  concat = (l1, l2) -> l1.concat(l2)
  remove = (list, element) ->
    copy = list.concat []
    i = copy.indexOf element
    copy.splice i, 1
    return copy

  Given ->
    @s1 = Stream()
    @s2 = Stream()
  When ->
    @subject = reduceMerge [], [
      [ @s1, concat ]
      [ @s2, remove ]
    ]
    @s1.put(1)
    @s1.put(2)
    @s2.put(1)
    @result = @subject.extract()
  Then -> @result.should.deep.equal [ 2 ]

  describe 'adds previous stream events', ->
    Given ->
      @s1.put 'a'
      @s1.put 'b'
      @s2.put 'b'
    Then -> @result.should.deep.equal [ 'a', 2 ]

