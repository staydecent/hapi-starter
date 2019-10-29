const Joi = require('@hapi/joi')

module.exports.userSchema = Joi.object({
  id: Joi.number().integer().alter({
    GET: (schema) => schema.required(),
    POST: (schema) => schema.forbidden()
  }),
  email: Joi.string().email().required(),
  password: Joi.any().strip().forbidden(),
  updatedAt: Joi.date(),
  createdAt: Joi.date(),
  checkPassword: Joi.function(),
  createToken: Joi.function()
})
