R = require 'ramda'
Stream = getDep 'lib/stream'

describe 'stream', ->

  describe '#extract', ->
    Given -> @subject = Stream.of(1)
    When -> @result = @subject.extract()
    Then -> @result == 1

  describe '#put', ->
    Given -> @subject = Stream()
    When ->
      @subject.put(1)
      @result = @subject.extract()
    Then -> @result == 1

  describe '#of', ->
    When ->
      s = Stream.of('foo')
      @result = s.extract()
    Then -> @result == 'foo'

  describe '#subscribe', ->
    Given -> @subject = Stream()
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
    Given -> @subject = Stream()
    When -> @s2 = @subject.map(R.add(1))

    describe '- creates a new stream emitting mapped values', ->
      When ->
        @s2.subscribe (@result) =>
        @subject.put 1
      Then -> @result == 2

      describe '- deep map', ->
        When ->
          s3 = @s2.map(R.multiply(5))
          s3.subscribe (@result) =>
          @subject.put 2
        Then -> @result == 15

    describe '- contains nothing if the original stream was empty', ->
      When -> @result = @s2.extract()
      Then -> @result == undefined

    describe '- contains the last element, mapped', ->
      Given -> @subject.put(1)
      When -> @result = @s2.extract()
      Then -> @result == 2

  describe '#reduce', ->
    appendTo = R.flip R.append
    When ->
      @s1 = Stream.of(1)
      @s2 = @s1.reduce appendTo, []
      @result = @s2.extract()
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
        @result = s3.extract()
      Then -> @result.should.deep.equal [ 3, 1 ]

  describe '#unsubscribe', ->
    Given -> @subject = Stream()
    When ->
      cb = (@result) =>
      @subject.subscribe cb
      @subject.unsubscribe cb
      @subject.put 'foo'
    Then -> @result == undefined

  describe '#drain', ->
    Given ->
      @subject = Stream()
      @subject.put(1)
      @subject.put(2)

    describe '- on original stream', ->
      When -> @result = @subject.drain()
      Then -> @result.should.deep.equal [ 1, 2 ]

    describe '- on mapped stream', ->
      Given -> @mapped = @subject.map R.add(1)
      When -> @result = @mapped.drain()
      Then -> @result.should.deep.equal [ 2, 3 ]

      describe '- with later received events', ->
        Given -> @subject.put(3)
        Then -> @result.should.deep.equal [ 2, 3, 4 ]

    describe '- on filtered stream', ->

  describe '#filter', ->
    Given -> @subject = Stream()
    When ->
      @result = []
      @filtered = @subject.filter(R.is(Number))
      @filtered.subscribe (v) => @result.push v
      @subject.put '1'
      @subject.put 1
      @subject.put {}
      @subject.put 2
    Then -> @result.should.deep.equal [ 1, 2 ]
