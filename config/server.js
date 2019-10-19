const environment = process.env.NODE_ENV || 'development'

// NOTE: all paths are relative to `../index.js` not this file.
module.exports = {
  server: {
    port: 3000,
    host: 'localhost'
  },
  register: {
    plugins: [
      'blipp',
      'hapi-auth-bearer-token',
      './plugins/restful',
      {
        plugin: './plugins/models',
        options: require('./db')[environment]
      },

      // Your apps
      // ---

      './apps/user'
    ]
  }
}
