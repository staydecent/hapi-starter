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
      const methods = {}
      for (const k in defn) {
        methods[k] = defn[k].bind(null, knex)
      }
      models[modelName] = {
        ...methods,
        objects: {
          all (select = '*') {
            return knex.select(select).from(tableName)
          },

          filter (where, select = '*') {
            where = Array.isArray(where) ? snake(where) : [where]
            return knex.select(select).where(...where).from(tableName)
          },

          async get (where, select = '*') {
            where = Array.isArray(where) ? snake(where) : [where]
            const res = await knex.select(select).limit(1).where(...where).from(tableName)
            return Array.isArray(res) ? res[0] : undefined
          },

          async del (where) {
            where = Array.isArray(where) ? snake(where) : [where]
            const rows = await knex(tableName).where(...where).del()
            return rows
          },

          async update (where, params) {
            where = Array.isArray(where) ? where : [where]
            const res = await knex(tableName).where(...where).update(snake(params))
            return res
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

function snake (obj) {
  const ret = {}
  for (const k in obj) {
    ret[toSnakeCase(k)] = obj[k]
  }
  return ret
}

function toSnakeCase (str) {
  let ret = ''
  let prevLowercase = false
  for (const s of str) {
    const isUppercase = s.toUpperCase() === s
    if (isUppercase && prevLowercase) {
      ret += '_'
    }
    ret += s
    prevLowercase = !isUppercase
  }
  return ret.toLowerCase()
}
