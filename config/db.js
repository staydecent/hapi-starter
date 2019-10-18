const path = require('path')
const postProcessResponse = require('../libs/post-process-response')

module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    debug: true,
    postProcessResponse,
    connection: {
      filename: path.resolve(__dirname, '../dev.sqlite')
    },
    migrations: {
      tableName: 'migrations'
    }
  },

  test: {
    client: 'sqlite3',
    useNullAsDefault: true,
    debug: true,
    connection: {
      filename: ':memory:'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/production'
    },
    useNullAsDefault: true
  }
}
