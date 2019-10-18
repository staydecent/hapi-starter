module.exports = {
  name: 'RestfulPlugin',
  version: '1.0.0',
  register: async function (server) {
    const list = (route, { queryset, schema }) => async (request, h) => {
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
    }

    server.decorate('handler', 'resourceList', list)

    const detail = (route, { queryset, schema }) => async (request, h) => {
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
    }

    server.decorate('handler', 'resourceDetail', detail)
  }
}
