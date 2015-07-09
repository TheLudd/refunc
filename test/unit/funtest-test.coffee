funtest = require '../../lib/funtest'

describe 'funtest', ->

  When -> @subject = funtest()
  Then ->
