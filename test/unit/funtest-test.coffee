R = require 'ramda'
chai = require 'chai'
chai.should()
stream = require '../../lib/stream'

describe 'stream', ->

  When ->
    Stream = stream(R)
    @subject = Stream()

  describe '#put', ->
    When ->
      @subject.put(1)
      @result = @subject()
    Then -> @result.should.deep.equal [ 1 ]

  describe '#subscribe', ->
    When -> @subject.subscribe(@subscribeFn)

    describe '- receives events', ->
      Given -> @subscribeFn = (@result) =>
      When -> @subject.put 'foo'
      Then -> @result == 'foo'

    describe '- receives multiple events', ->
      Given ->
        @result = []
        @subscribeFn = (r) => @result.push r
      When ->
        @subject.put 'foo'
        @subject.put 'bar'
      Then -> @result.should.deep.equal ['foo', 'bar']

  describe '#map', ->
    When ->
      @s2 = @subject.map(R.add(1))
      @s2.subscribe (@result) =>
      @subject.put 1
    Then -> @result == 2

    describe '- deep map', ->
      When ->
        s3 = @s2.map(R.multiply(5))
        s3.subscribe (@result) =>
        @subject.put 2
      Then -> @result == 15
