const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const Joi = require('@hapi/joi')

const userSchema = Joi.object({
  id: Joi.number().integer(),
  email: Joi.string().email(),
  password: Joi.any().strip(),
  updatedAt: Joi.date(),
  createdAt: Joi.date()
})

const usersSchema = Joi.array().items(userSchema)

const newTokenForUser = async (knex, userId) => {
  const key = crypto
    .createHash('sha1')
    .update(crypto.randomBytes(20) + userId)
    .digest('hex')
  await knex
    .insert({ user: userId, key })
    .into('tokens')
  return key
}

// path('users', api.Users.as_view(), name='users'),
// path('users/<int:pk>', api.Users.as_view(), name='user'),
// path('users/signup', api.Signup.as_view(), name='signup'),
// path('users/login', api.Login.as_view(), name='login'),
// path('users/forgot-password', api.ForgotPassword.as_view(), name='forgot-password'),
// path('users/reset-password', api.ResetPassword.as_view(), name='reset-password'),
module.exports = {
  name: 'users',
  version: '1.0.0',
  register: function (server, options) {
    server.route({
      method: 'GET',
      path: '/users',
      handler: {
        resourceList: {
          queryset: async () => await server.knex.select('*').from('users'),
          schema: usersSchema
        }
      }
    })

    server.route({
      method: 'GET',
      path: '/users/{id}',
      handler: {
        resourceDetail: {
          queryset: async (request) =>
            await server.knex('users').where({ id: request.params.id }).first('*'),
          schema: userSchema
        }
      }
    })

    server.route({
      method: 'GET',
      path: '/users/signup',
      handler: async (request, h) => {
        const email = request.payload.email
        const password = request.payload.password

        // Check existing user with email, otherwise create new user
        const user = await server.knex('users').where({ email: email }).first('id')
        if (user) {
          return h.response({
            errors: ['An account with that email already exists.']
          }).code(400)
        } else {
          const hashed = await bcrypt.hash(password, 10)
          const [id] = await knex
            .returning('id')
            .insert({ email, password: hashed })
            .into('users')

          // # Mail.send(settings.MAIL_NEW_ACCOUNT, user, {'email': 'john@example.com'})
          // Create a login token right away
          const token = await newTokenForUser(knex, userId)
          return h.response({
            userId: id,
            token: token.key
          }).code(201)
        }
      }
    })
  }
}
