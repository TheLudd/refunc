fiterFrom = getDep './lib/fiter-from'
stream = require '../../lib/stream'
R = require 'ramda'

describe 'fiterFrom', ->

  Given -> @result = []
  When -> @subject = fiterFrom(R.is(Number), @stream)
  When -> @subject.subscribe (r) => @result.push r

  describe 'only receives events matching the predicate', ->
    Given -> @stream = stream()

    describe 'matching', ->
      When -> @stream.put(1)
      Then -> @result.should.deep.equal [ 1 ]

    describe 'not matching', ->
      When -> @stream.put('')
      Then -> @result.should.deep.equal []

    describe 'receives all previous values', ->
      Given ->
        @stream.put(1)
        @stream.put(2)
        @stream.put('')
      When -> @result = @subject.drain()
      Then -> @result.should.deep.equal [ 1, 2 ]
