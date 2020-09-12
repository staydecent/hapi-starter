const Joi = require('@hapi/joi')
const W = require('wasmuth')

const modelSchema = Joi.object({
  knex: Joi.any(),
  _methods: Joi.strip()
})

const stripMethods = (result, schema) =>
  schema
    .concat(Joi.object(W.pipe(
      W.map(k => [k, Joi.strip()]),
      W.fromPairs
    )(result._methods)))

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
  const json = schema.tailor('get').describe()
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
    server.decorate('handler', 'resourceSchema', (route, { model }) => (request, h) => {
      return h.response(
        convert(model, route.settings.description, server.models()[model].schema)
      ).code(200)
    })

    // Resouce list handler
    server.decorate('handler', 'resourceList', (route, { model, queryset }) => async (request, h) => {
      const errors = []
      try {
        const Model = server.models()[model]
        const results = await queryset(request, Model)
        const instanceSchema = modelSchema.concat(Model.schema).tailor('get')
        const manySchema = Joi.array().items(stripMethods(results[0], instanceSchema))
        const { value, error } = manySchema.validate(results, { presence: 'required' })
        if (error) {
          errors.push(error.details)
        } else {
          return { results: value }
        }
      } catch (err) {
        errors.push(err)
      }
      return h.response({ errors }).code(500)
    })

    // Resource detail handler
    server.decorate('handler', 'resourceDetail', (route, { model, queryset }) => async (request, h) => {
      const errors = []
      try {
        const Model = server.models()[model]
        const result = await queryset(request, Model)
        const { value, error } = stripMethods(result, Model.schema).validate(result, { presence: 'required' })
        if (error) {
          errors.push(error.details)
        } else {
          return value
        }
      } catch (err) {
        errors.push(err)
      }
      return h.response({ errors }).code(500)
    })
  }
}
