const bcrypt = require('bcryptjs')

const { userSchema, usersSchema } = require('./schema')
const { newTokenForUser } = require('./libs')

module.exports = [
  // Users list
  {
    method: 'GET',
    path: '/users',
    handler: {
      resourceList: {
        queryset: async (request) => request.knex.select('*').from('users'),
        schema: usersSchema
      }
    }
  },

  // User detail
  {
    method: 'GET',
    path: '/users/{id}',
    handler: {
      resourceDetail: {
        queryset: async (request) => request.knex('users').where({ id: request.params.id }).first('*'),
        schema: userSchema
      }
    }
  },

  // Signup
  {
    method: 'GET',
    path: '/users/signup',
    handler: async (request, h) => {
      const email = request.payload.email
      const password = request.payload.password

      // Check existing user with email, otherwise create new user
      const user = await request.knex('users').where({ email: email }).first('id')
      if (user) {
        return h.response({
          errors: ['An account with that email already exists.']
        }).code(400)
      } else {
        const hashed = await bcrypt.hash(password, 10)
        const [id] = await request.knex
          .returning('id')
          .insert({ email, password: hashed })
          .into('users')

        // # Mail.send(settings.MAIL_NEW_ACCOUNT, user, {'email': 'john@example.com'})
        // Create a login token right away
        const token = await newTokenForUser(request.knex, id)
        return h.response({
          userId: id,
          token: token.key
        }).code(201)
      }
    }
  }
]
