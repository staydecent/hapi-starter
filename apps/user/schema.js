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
  createdAt: Joi.date()
})

// Fields are required by default.
// If only supplying `type` you can pass the string descriptor
// instead of an object. If the value depends on the request
// context, then you can return a function that returns an object.
// module.exports.userSchema = {
//   id: ({ method }) => ({
//     type: 'integer',
//     required: method === 'GET',
//     forbidden: method === 'POST'
//   }),
//   password: ({ method }) => method === 'GET'
//     ? { type: 'strip' }
//     : { type: 'string', validate: { min: 6 } }
//   }
//   email: 'email',
//   updatedAt: 'date',
//   createdAt: 'date'
// }
