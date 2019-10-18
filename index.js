const environment = process.env.NODE_ENV || 'development'

const path = require('path')
const glob = require('glob')

const Hapi = require('@hapi/hapi')
const AuthBearer = require('hapi-auth-bearer-token')

const KnexPlugin = require('./plugins/knex')

const db = require('./config/db')[environment]

const handleErr = (err) => {
  console.log(err)
  process.exit(1)
}

process.on('unhandledRejection', handleErr)

const start = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  })

  // Setup DB
  // ---

  await server.register({
    plugin: KnexPlugin,
    options: db
  })

  // Setup Authentication
  // ---

  await server.register(AuthBearer)

  server.auth.strategy('token', 'bearer-access-token', {
    tokenType: 'Token',
    validate: async (request, token, h) => {
      // here is where you validate your token
      // comparing with token from your database for example
      const isValid = token === '1234'
      const credentials = { token }
      return { isValid, credentials }
    }
  })

  // Default to all routes requiring Authentication.
  // Override by providing: `options: { auth: false }` on your route.
  server.auth.default('token')

  // Load all app plugins and start the show!
  // ---

  glob('apps/**/index.js', async (err, files) => {
    err && handleErr(err)
    await server.register(files.map(f => require(path.resolve(f))))
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

start()
