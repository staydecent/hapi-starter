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
  }
}
