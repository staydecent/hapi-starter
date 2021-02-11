const Joi = require('@hapi/joi')

module.exports.userSchema = Joi.object({
  id: Joi.number().integer().alter({
    get: (integer) => integer.required(),
    post: (integer) => integer.forbidden()
  }),
  email: Joi.string().email().required(),
  password: Joi.any().alter({
    get: (any) => any.strip(),
    post: () => Joi.string().min(6)
  }),
  updatedAt: Joi.date(),
  createdAt: Joi.date(),
  checkPassword: Joi.function(),
  createToken: Joi.function()
})
