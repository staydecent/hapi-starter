const crypto = require('crypto')
const bcrypt = require('bcryptjs')

module.exports.User = {
  async createUser ({ knex, models }, { email, password }) {
    const hashed = await bcrypt.hash(password, 10)
    const [id] = await knex
      .insert({ email, password: hashed })
      .into('users')
    return models().User.objects.get({ id })
  },

  methods: {
    checkPassword (userInput) {
      return bcrypt.compare(userInput, this.password)
    },

    async createToken () {
      const key = await crypto
        .createHash('sha1')
        .update(crypto.randomBytes(20) + this.id)
        .digest('hex')
      await this.knex
        .insert({ user: this.id, key })
        .into('tokens')
      return key
    }
  }
}
