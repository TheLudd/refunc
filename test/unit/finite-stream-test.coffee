R = require 'ramda'
FiniteStream = getDep './lib/finite-stream'

describe 'FiniteStream', ->

  Given ->
    @subject = FiniteStream()
    @result = []
    @pushResult = @result.push.bind(@result)

  describe '#subscribe', ->
    Given ->
      @endFn = => @ended = true
    When -> @subject.subscribe @result.push.bind(@result), @endFn
    Invariant -> @ended == @expectedToHaveEnded

    describe '- receives events', ->
      When -> @subject.put 'foo'
      Then -> @result.should.deep.equal [ 'foo' ]

      describe ', including multiple', ->
        When -> @subject.put 'bar'
        Then -> @result.should.deep.equal [ 'foo', 'bar' ]

      describe 'from multiple subscribers', ->
        Given ->
          @result2 = []
          @subject.subscribe @result2.push.bind(@result2)
        Then -> @result2.should.deep.equal [ 'foo' ]

    describe '- can be ended', ->
      Given -> @expectedToHaveEnded = true
      When -> @subject.end()

      describe 'by several subscribers', ->
        Given ->
          @endFn2 = => @ended2 = true
          noop = ->
          @subject.subscribe noop, @endFn2
        Then -> @ended2 == true

  describe '#map', ->
    When ->
      @newStream = @subject.map(R.add(1), @endFn)
      @newStream.subscribe @pushResult

    describe '- receives mapped results', ->
      When -> @subject.put 1
      Then -> @result.should.deep.equal [ 2 ]

    describe '- is ended when the parent stream ends', ->
      Given -> @endFn = => @isEnded = true
      When -> @subject.end()
      Then -> @isEnded == true
