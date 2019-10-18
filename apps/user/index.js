// path('users', api.Users.as_view(), name='users'),
// path('users/<int:pk>', api.Users.as_view(), name='user'),
// path('users/signup', api.Signup.as_view(), name='signup'),
// path('users/login', api.Login.as_view(), name='login'),
// path('users/forgot-password', api.ForgotPassword.as_view(), name='forgot-password'),
// path('users/reset-password', api.ResetPassword.as_view(), name='reset-password'),
module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async function (server, options) {
    server.route({
      method: 'GET',
      path: '/users',
      // options: { auth: false },
      handler: (request, h) => {
        console.log({ server })
        return 'Hello World!'
      }
    })
  }
}
