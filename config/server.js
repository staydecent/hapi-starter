const environment = process.env.NODE_ENV || 'development'

// NOTE: all paths are relative to `../index.js` not this file.
module.exports = {
  server: {
    port: 3000,
    host: 'localhost'
  },
  register: {
    plugins: [
      'hapi-auth-bearer-token',
      './plugins/restful',
      {
        plugin: './plugins/knex',
        options: require('./db')[environment]
      },

      // Your apps
      // ---

      './apps/user'
    ]
  }
}
