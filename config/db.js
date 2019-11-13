const path = require('path')
const postProcessResponse = require('../libs/post-process-response')

const baseConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  debug: true,
  postProcessResponse,
  connection: {
    filename: path.resolve(__dirname, '../dev.sqlite')
  },
  migrations: {
    tableName: 'migrations',
    directory: [
      path.resolve(__dirname, '../apps/user/migrations')
    ]
  }
}

module.exports = {
  development: {
    ...baseConfig,
    connection: {
      filename: path.resolve(__dirname, '../dev.sqlite')
    }
  },

  test: {
    ...baseConfig,
    debug: false,
    connection: {
      filename: ':memory:'
    }
  },

  production: {
    ...baseConfig,
    client: 'pg',
    connection: process.env.DATABASE_URL,
    debug: false
  }
}
