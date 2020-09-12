const Joi = require('@hapi/joi')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

module.exports.User = {
  schema: Joi.object({
    id: Joi.number().integer().alter({
      get: (integer) => integer.required(),
      post: (integer) => integer.forbidden()
    }),
    email: Joi.string().email().required(),
    password: Joi.any().alter({
      get: (any) => any.strip(),
      post: () => Joi.string().min(6)
    }),
    updatedAt: Joi.date(),
    createdAt: Joi.date()
  }),

  // Instance methods. When you get an instance of a User
  // back, you can call these methods: `user.createToken()`
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
  },

  // Static functions. These are not attached to instances,
  // but instead are helper functions related to the User model.
  // The first param of any static function will be the Hapi
  // server object.
  async createUser ({ knex, models }, { email, password }) {
    const hashed = await bcrypt.hash(password, 10)
    const [id] = await knex
      .insert({ email, password: hashed })
      .into('users')
    return models().User.objects.get({ id })
  }
}
