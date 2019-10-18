const Hapi = require('@hapi/hapi')
const AuthBearer = require('hapi-auth-bearer-token')

const KnexPlugin = require('./knex')

const apps = [
  require('./users')
]

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
    options: {
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: ':memory:'
      },
      migrations: {
        tableName: 'migrations'
      }
    }
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

  await server.register(apps)
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

start()
