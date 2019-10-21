const crypto = require('crypto')
const bcrypt = require('bcryptjs')

module.exports.User = {
  async createUser (knex, { email, password }) {
    const hashed = await bcrypt.hash(password, 10)
    const [userId] = await knex
      .insert({ email, password: hashed })
      .into('users')
    return userId
  },

  checkPassword (knex, userInput, hash) {
    return bcrypt.compare(userInput, hash)
  },

  async createTokenForUser (knex, userId) {
    const key = await crypto
      .createHash('sha1')
      .update(crypto.randomBytes(20) + userId)
      .digest('hex')
    await knex
      .insert({ user: userId, key })
      .into('tokens')
    return key
  }
}
