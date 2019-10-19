'use strict'

const Glue = require('@hapi/glue')

const manifest = require('./config/server')

const options = {
  relativeTo: __dirname
}

const startServer = async function (initOnly = false) {
  try {
    const server = await Glue.compose(manifest, options)
    if (initOnly) {
      await server.initialize()
    } else {
      await server.start()
      console.log('Server running on %s', server.info.uri)
    }
    return server
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

// Don't start the server if testing
if (process.env.NODE_ENV !== 'test') {
  startServer()
}

// Export for tests
module.exports = startServer
