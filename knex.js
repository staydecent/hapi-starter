const defaultOptions = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: ':memory:'
  },
  migrations: {
    tableName: 'migrations'
  }
}

module.exports = {
  name: 'KnexPlugin',
  version: '1.0.0',
  register: async function (server, options) {
    let knex

    console.log('KnexPlugin', { options })

    server.decorate('server', 'knex', knex)

    server.ext('onPreStart', () => {
      knex = require('knex')(Object.assign(defaultOptions, options))
      server.decorate('server', 'knex', knex)
    })

    server.ext('onPostStop', () => {
      knex && knex.destroy()
    })
  }
}
