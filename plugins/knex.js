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

    server.ext('onPreStart', () => {
      const opts = Object.assign(defaultOptions, options)
      knex = require('knex')(opts)
      server.decorate('server', 'knex', knex)
      server.decorate('request', 'knex', knex)
      server.decorate('toolkit', 'knex', knex)
    })

    server.ext('onPostStop', () => {
      knex && knex.destroy()
    })
  }
}
