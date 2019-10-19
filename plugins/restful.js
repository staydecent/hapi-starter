module.exports = {
  name: 'RestfulPlugin',
  version: '1.0.0',
  register: async function (server) {
    // Resouce list handler
    server.decorate('handler', 'resourceList', (route, { queryset, schema }) => async (request, h) => {
      const errors = []
      try {
        const results = await queryset(request)
        const { value, error } = schema.validate(results, { presence: 'required' })
        if (error) {
          errors.push(error.details)
        } else {
          return { results: value }
        }
      } catch (err) {
        console.log({ err })
        errors.push(err)
      }
      return h.response({ errors }).code(500)
    })

    // Resource detail handler
    server.decorate('handler', 'resourceDetail', (route, { queryset, schema }) => async (request, h) => {
      const errors = []
      try {
        const result = await queryset(request)
        const { value, error } = schema.validate(result, { presence: 'required' })
        if (error) {
          errors.push(error.details)
        } else {
          return value
        }
      } catch (err) {
        console.log({ err })
        errors.push(err)
      }
      return h.response({ errors }).code(500)
    })
  }
}
