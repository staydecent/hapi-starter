const { signup, login } = require('./handlers')

module.exports = [
  {
    options: {
      description: 'JSON schema for Users',
      auth: false
    },
    method: 'OPTIONS',
    path: '/users',
    handler: {
      resourceSchema: {
        model: 'User'
      }
    }
  },

  {
    options: {
      description: 'List all users'
    },
    method: 'GET',
    path: '/users',
    handler: {
      resourceList: {
        model: 'User',
        queryset: (request, User) => User.objects.all()
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
        model: 'User',
        queryset: (request, User) => User.objects.get({ id: request.params.id })
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
