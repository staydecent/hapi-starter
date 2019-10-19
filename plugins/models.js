const check = require('check-arg-types')

const toType = check.prototype.toType

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
  name: 'ModelsPlugin',
  version: '0.1.0',
  register: function (server, options) {
    const opts = Object.assign(defaultOptions, options)
    const knex = require('knex')(opts)
    const models = {}

    const registerModel = (modelName, tableName, defn = {}) => {
      models[modelName] = {
        ...defn,
        objects: {
          all (select = '*') {
            return knex.select(select).from(tableName)
          },

          filter (where, select = '*') {
            return toType(where) === 'array'
              ? knex.select(select).where(...where).from(tableName)
              : knex.select(select).where(where).from(tableName)
          },

          get (where, select = '*') {
            return knex(tableName).where(where).first(select)
          }
        }
      }
    }

    server.decorate('server', 'migrate', knex.migrate)
    server.decorate('server', 'seed', knex.seed)
    server.decorate('server', 'registerModel', registerModel)
    server.decorate('server', 'models', () => models)
    server.decorate('request', 'models', () => models)
    server.decorate('toolkit', 'models', () => models)

    server.ext('onPreStart', () => {
      server.decorate('server', 'knex', knex)
      server.decorate('request', 'knex', knex)
      server.decorate('toolkit', 'knex', knex)
    })

    server.ext('onPostStop', () => {
      knex && knex.destroy()
    })
  }
}
