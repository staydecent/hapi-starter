const crypto = require('crypto')

// @TODO: Cleanup old tokens if creating a new one
const newTokenForUser = async (knex, userId) => {
  const key = crypto
    .createHash('sha1')
    .update(crypto.randomBytes(20) + userId)
    .digest('hex')
  await knex
    .insert({ user: userId, key })
    .into('tokens')
  return key
}

module.exports = {
  newTokenForUser
}
