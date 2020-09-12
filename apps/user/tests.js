'use strict'

const path = require('path')
const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script()
const startServer = require('../../index')

describe('apps.user', () => {
  let server
  let User

  beforeEach(async () => {
    server = await startServer(true)
    User = server.models().User
    await server.migrate.latest({ directory: path.resolve(__dirname, 'migrations') })
    await server.seed.run({ directory: path.resolve('./config/seeds') })
  })

  afterEach(async () => {
    await server.knex('users').truncate()
    await server.stop()
  })

  it('requires authentication', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/users'
    })
    expect(res.statusCode).to.equal(401)
  })

  it('allows new signups', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/users/signup',
      payload: { email: 'new@example.org', password: 'abc123' }
    })
    expect(res.statusCode).to.equal(201)
    expect(res.result.userId).to.exist()
    expect(res.result.token).to.exist()
  })

  it('handles login', async () => {
    const payload = { email: 'login@example.org', password: 'abc123' }
    const userId = await User.createUser(payload)
    expect(userId).to.exist()
    const res = await server.inject({
      method: 'POST',
      url: '/users/login',
      payload: payload
    })
    expect(res.statusCode).to.equal(200)
    expect(res.result.userId).to.exist()
    expect(res.result.token).to.exist()
  })

  it('handles bad login credentials', async () => {
    const payload = { email: 'login@example.org', password: 'abc123' }
    const res = await server.inject({
      method: 'POST',
      url: '/users/login',
      payload: payload
    })
    expect(res.statusCode).to.equal(400)
  })

  it('responds with list of users', async () => {
    const payload = { email: 'login@example.org', password: 'abc123' }
    const user = await User.createUser(payload)
    expect(user).to.exist()
    const token = await user.createToken()
    expect(token).to.exist()
    const res = await server.inject({
      method: 'GET',
      url: '/users',
      headers: { Authorization: `Token ${token}` }
    })
    expect(res.statusCode).to.equal(200)
    expect(res.result.results).to.exist()
    expect(res.result.results.length).to.be.above(1)
  })
})
