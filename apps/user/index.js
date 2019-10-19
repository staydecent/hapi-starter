const routes = require('./routes')

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
      validate: async (request, token, h) => {
        // here is where you validate your token
        // comparing with token from your database for example
        const isValid = token === '1234'
        const credentials = { token }
        return { isValid, credentials }
      }
    })

    // Default to all routes requiring Authentication.
    // Override by providing: `options: { auth: false }` on your route.
    server.auth.default('token')

    // Load our user routes
    server.route(routes)
  }
}
