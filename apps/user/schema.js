const Joi = require('@hapi/joi')

module.exports.userSchema = Joi.object({
  id: Joi.number().integer(),
  email: Joi.string().email(),
  password: Joi.any().strip(),
  updatedAt: Joi.date(),
  createdAt: Joi.date(),
  checkPassword: Joi.function(),
  createToken: Joi.function()
})
