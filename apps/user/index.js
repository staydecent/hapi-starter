const Joi = require('@hapi/joi')

const userSchema = Joi.object({
  id: Joi.number().integer(),
  email: Joi.string().email(),
  password: Joi.any().strip(),
  updatedAt: Joi.date(),
  createdAt: Joi.date()
})

const usersSchema = Joi.array().items(userSchema)

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
  }
}
