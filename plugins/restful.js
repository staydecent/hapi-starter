const Joi = require('@hapi/joi')
const W = require('wasmuth')

const modelSchema = Joi.object({
  knex: Joi.any()
})

const rules = (field) => {
  const ret = {}
  const min = W.pipe(
    W.pathOr([], 'rules'),
    W.find(r => r.name === 'min')
  )(field)
  if (min) {
    ret.minLength = min.args.limit
  }
  return ret
}

const convert = (model, description, schema) => {
  const json = schema.tailor('post').describe()
  const required = []
  for (const k in json.keys) {
    const field = json.keys[k]
    if (W.pathEq('flags.presence', 'required', field)) {
      required.push(k)
    }
  }
  return {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: schema.type,
    title: model,
    description,
    required,
    properties: W.map((k, v) => ({
      ...v,
      ...rules(v)
    }), json.keys)
  }
}

module.exports = {
  name: 'RestfulPlugin',
  version: '1.0.0',
  register: async function (server) {
    // Resouce specification handler
    server.decorate('handler', 'resourceSchema', (route, { model, schema }) => (request, h) => {
      return h.response(
        convert(model, route.settings.description, schema)
      ).code(200)
    })

    // Resouce list handler
    server.decorate('handler', 'resourceList', (route, { queryset, schema }) => async (request, h) => {
      const errors = []
      try {
        const results = await queryset(request, server.models())
        const manySchema = Joi.array().items(modelSchema.concat(schema).tailor('get'))
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
