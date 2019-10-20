const { newTokenForUser } = require('./libs')

module.exports = {
  signup,
  login
}

async function signup (request, h) {
  const { User } = h.models()

  const email = request.payload.email
  const password = request.payload.password

  // Check existing user with email, otherwise create new user
  const user = await User.objects.get({ email })
  if (user) {
    return h.response({
      errors: ['An account with that email already exists.']
    }).code(400)
  } else {
    const userId = await User.createUser({ email, password })

    // # Mail.send(settings.MAIL_NEW_ACCOUNT, user, {'email': 'john@example.com'})
    // Create a login token right away
    const token = await newTokenForUser(request.knex, userId)
    return h.response({ userId, token }).code(201)
  }
}

async function login (request, h) {
  const { User } = h.models()

  const http400 = err => h.response({ errors: [err] }).code(400)

  const email = request.payload.email
  const password = request.payload.password
  if (!email || !password) {
    return http400('Must include "email" and "password".')
  }

  const user = await User.objects.get({ email })
  if (!user) {
    return http400(`User with email "${email}" does not exist.`)
  }

  const passOk = await User.checkPassword(password, user.password)
  if (!passOk) {
    return http400('Unable to log in with provided credentials.')
  }

  const token = await newTokenForUser(h.knex, user.id)
  return h.response({ userId: user.id, token: token }).code(200)
}
