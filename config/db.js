const path = require('path')

function convertToCamel (row) {
  const newRow = {}
  for (const key in row) {
    let ret = ''
    let prevUnderscore = false
    for (const s of key) {
      const isUnderscore = s === '_'
      if (isUnderscore) {
        prevUnderscore = true
        continue
      }
      if (!isUnderscore && prevUnderscore) {
        ret += s.toUpperCase()
        prevUnderscore = false
      } else {
        ret += s.toLowerCase()
      }
    }
    newRow[ret] = row[key]
  }
  return newRow
}

const postProcessResponse = (result, queryContext) => {
  if (Array.isArray(result)) {
    return result.map(row => convertToCamel(row))
  } else {
    return convertToCamel(result)
  }
}

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
