reduceMerge = getDep 'lib/reduce-merge'
Stream = getDep 'lib/stream'

describe 'reduceMerge', ->

  concat = (l1, l2) -> l1.concat(l2)
  remove = (list, element) ->
    copy = list.concat []
    i = copy.indexOf element
    copy.splice i, 1
    return copy

  When -> @subject = reduceMerge [], @reduceStreams

  describe 'when joining several streams', ->
    Given ->
      @s1 = Stream()
      @s2 = Stream()
      @reduceStreams = [
        [ @s1, concat ]
        [ @s2, remove ]
      ]

    describe 'contains the initial value before any events are put', ->
      When -> @result = @subject.extract()
      Then -> @result.should.deep.equal []

    describe 'contains the reduced value', ->
      When ->
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
      When ->
        @s1.put(2)
        @result = @subject.extract()
      Then -> @result.should.deep.equal [ 'a', 2 ]

  describe 'contains the initial value if no streams are merged', ->
    Given -> @reduceStreams = []
    When -> @result = @subject.extract()
    Then -> @result.should.deep.equal [ ]
