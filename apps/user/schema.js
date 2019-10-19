const Joi = require('@hapi/joi')

const userSchema = Joi.object({
  id: Joi.number().integer(),
  email: Joi.string().email(),
  password: Joi.any().strip(),
  updatedAt: Joi.date(),
  createdAt: Joi.date()
})

const usersSchema = Joi.array().items(userSchema)

module.exports = {
  userSchema,
  usersSchema
}
