const bcrypt = require('bcryptjs')

const { newTokenForUser } = require('./libs')

module.exports = {
  signup,
  login
}

async function signup (request, h) {
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
    return h.response({ userId: id, token: token.key }).code(201)
  }
}

async function login (request, h) {
  const http400 = err => h.response({ errors: [err] }).code(400)

  const email = request.payload.email
  const password = request.payload.password
  if (!email || !password) {
    return http400('Must include "email" and "password".')
  }

  const user = h.models().User.objects.get({ email })
  if (!user) {
    return http400(`User with email "${email}" does not exist.`)
  }

  const passOk = await bcrypt.compare(password, user.password)
  if (!passOk) {
    return http400('Unable to log in with provided credentials.')
  }

  const token = await newTokenForUser(h.knex, user.id)
  return h.response({ userId: user.id, token: token.key }).code(201)
}
