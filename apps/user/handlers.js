module.exports = {
  signup,
  login
}

async function signup (request, h) {
  const { User } = h.models()
  const { email, password } = request.payload

  // Check existing user with email, otherwise create new user
  const user = await User.objects.get({ email })
  if (user) {
    return h.response({
      errors: ['An account with that email already exists.']
    }).code(400)
  } else {
    const user = await User.createUser({ email, password })
    // # Mail.send(settings.MAIL_NEW_ACCOUNT, user, {'email': 'john@example.com'})
    // Create a login token right away
    const token = await user.createToken()
    return h.response({ userId: user.id, token }).code(201)
  }
}

async function login (request, h) {
  const http400 = err => h.response({ errors: [err] }).code(400)
  const { User } = h.models()
  const { email, password } = request.payload

  if (!email || !password) {
    return http400('Must include "email" and "password".')
  }

  const user = await User.objects.get({ email })
  if (!user) {
    return http400(`User with email "${email}" does not exist.`)
  }

  const passOk = await user.checkPassword(password)
  if (!passOk) {
    return http400('Unable to log in with provided credentials.')
  }

  const token = await user.createToken()
  return h.response({ userId: user.id, token: token }).code(200)
}
