'use strict'

const path = require('path')
const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script()
const startServer = require('../../index')

describe('GET /users', () => {
  let server

  beforeEach(async () => {
    server = await startServer(true)
    await server.migrate.latest({ directory: path.resolve('./config/migrations') })
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

  it('responds with list of users', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/users',
      headers: { Authorization: 'Token 1234' }
    })
    expect(res.statusCode).to.equal(200)
    expect(res.result.results).to.exist()
    expect(res.result.results.length).to.be.above(1)
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
    const userId = await server.models().User.createUser(payload)
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
})
