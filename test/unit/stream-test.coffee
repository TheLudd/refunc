R = require 'ramda'
chai = require 'chai'
chai.should()
Stream = require '../../lib/stream'

describe 'stream', ->

  When -> @subject = Stream()

  describe '#extract', ->
    Given -> @subject = Stream.of(1)
    When -> @result = @subject.extract()
    Then -> @result == 1

  describe '#put', ->
    When ->
      @subject.put(1)
      @result = @subject()
    Then -> @result == 1

  describe '#of', ->
    When ->
      s = Stream.of('foo')
      @result = s()
    Then -> @result == 'foo'

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

  describe '#ap', ->
    When ->
      s1 = Stream.of(R.add(1))
      s2 = s1.ap(Stream.of(2))
      @result = s2()
    Then -> @result == 3

  describe '#chain', ->
    When ->
      createLengthStream = (val) -> Stream.of val.length
      resultStream = Stream.of([4,5,6]).chain(createLengthStream)
      @result = resultStream()
    Then -> @result == 3

  describe '#reduce', ->
    appendTo = R.flip R.append
    When ->
      @s1 = Stream.of(1)
      @s2 = @s1.reduce appendTo, []
      @result = @s2()
    Then -> @result.should.deep.equal [ 1 ]

    describe '- adding new', ->
      When ->
        @s2.subscribe (@result) =>
        @s1.put(4)
      Then -> @result.should.deep.equal [ 1, 4 ]

      describe '- again', ->
        When -> @s1.put(5)
        Then -> @result.should.deep.equal [ 1, 4, 5 ]

    describe '- deep', ->
      When ->
        s3 = @s2.reduce R.concat, [ 3 ]
        @result = s3()
      Then -> @result.should.deep.equal [ 3, 1 ]

