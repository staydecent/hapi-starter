const routes = require('./routes')
const { User } = require('./models')

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
    // Setup Token authentication
    server.auth.strategy('token', 'bearer-access-token', {
      tokenType: 'Token',
      validate: async (request, key, h) => {
        const { Token } = server.models()
        const token = await Token.objects.get({ key })
        let isValid = token !== undefined

        // Only valid if last login within 7 days
        if (isValid) {
          const today = new Date()
          const createdAt = new Date(token.createdAt)
          const daysOld = Math.floor((createdAt - today) / (1000 * 60 * 60 * 24))
          if (daysOld > 7) {
            isValid = false
            Token.objects.del({ id: token.id })
          } else {
            Token.objects.update({ id: token.id }, { createdAt: new Date() })
          }
        }

        return { isValid, credentials: isValid ? token : {} }
      }
    })

    // Default to all routes requiring Authentication.
    // Override by providing: `options: { auth: false }` on your route.
    server.auth.default('token')

    // Register our models
    server.registerModel('User', 'users', User)
    server.registerModel('Token', 'tokens')

    // Load our user routes
    server.route(routes)
  }
}
