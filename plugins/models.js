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
      const { methods, ...funcs } = defn
      const createInstance = obj => {
        if (obj == null) return obj
        obj.knex = knex
        const instance = { ...obj }
        for (const k in methods) {
          instance[k] = methods[k].bind(obj)
        }
        return instance
      }
      for (const k in funcs) {
        funcs[k] = funcs[k].bind(null, server)
      }
      models[modelName] = {
        ...funcs,
        objects: {
          count () {
            return knex(tableName).count('id')
          },

          async all (select = '*') {
            const res = await knex.select(select).from(tableName)
            // @TODO: replace with generator to lazy wrap results
            return res.map(createInstance)
          },

          async filter (where, select = '*') {
            where = Array.isArray(where) ? snake(where) : [where]
            const res = await knex.select(select).where(...where).from(tableName)
            // @TODO: replace with generator to lazy wrap results
            return res.map(createInstance)
          },

          async create (params) {
            const [id] = await knex(tableName).insert(params)
            return this.get({ id })
          },

          async get (where, select = '*') {
            where = Array.isArray(where) ? snake(where) : [where]
            const res = await knex.select(select).limit(1).where(...where).from(tableName)
            return Array.isArray(res) ? createInstance(res[0]) : undefined
          },

          async getOrCreate (whereParams, select = '*') {
            const instance = await this.get(whereParams, select)
            if (instance) {
              return instance
            } else {
              return this.create(whereParams)
            }
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
