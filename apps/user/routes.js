const { userSchema } = require('./schema')
const { signup, login } = require('./handlers')

module.exports = [
  {
    options: {
      description: 'List all users'
    },
    method: 'GET',
    path: '/users',
    handler: {
      resourceList: {
        queryset: (request, { User }) => User.objects.all(),
        schema: userSchema
      }
    }
  },

  {
    options: {
      description: 'Display user specific info'
    },
    method: 'GET',
    path: '/users/{id}',
    handler: {
      resourceDetail: {
        queryset: (request, { User }) => User.objects.get({ id: request.params.id }),
        schema: userSchema
      }
    }
  },

  {
    options: {
      description: 'Signup user with email and password',
      auth: false
    },
    method: 'POST',
    path: '/users/signup',
    handler: signup
  },

  {
    options: {
      description: 'Login user with provided credentials',
      auth: false
    },
    method: 'POST',
    path: '/users/login',
    handler: login
  }
]
