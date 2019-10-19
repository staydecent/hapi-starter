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
    await server.stop()
  })

  it('requires authentication', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/users'
    })
    expect(res.statusCode).to.equal(401)
  })

  it('responds with list of users', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/users',
      headers: { Authorization: 'Token 1234' }
    })
    expect(res.statusCode).to.equal(200)
    expect(res.result.results).to.exist()
    expect(res.result.results.length).to.be.above(1)
  })
})
