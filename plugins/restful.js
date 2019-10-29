const Joi = require('@hapi/joi')

const modelSchema = Joi.object({
  knex: Joi.any()
})

module.exports = {
  name: 'RestfulPlugin',
  version: '1.0.0',
  register: async function (server) {
    // Resouce specification handler
    server.decorate('handler', 'resourceSpec', (route, { model, schema }) => (request, h) => {
      return h.response({ model, schema: schema.describe() }).code(200)
    })

    // Resouce list handler
    server.decorate('handler', 'resourceList', (route, { queryset, schema }) => async (request, h) => {
      const errors = []
      try {
        const results = await queryset(request, server.models())
        const manySchema = Joi.array().items(modelSchema.concat(schema))
        const { value, error } = manySchema.validate(results, { presence: 'required' })
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
        const result = await queryset(request, server.models())
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
