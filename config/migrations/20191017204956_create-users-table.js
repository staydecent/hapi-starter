
exports.up = knex =>
  knex.schema.createTable('users', t => {
    t.increments('id').primary()
    t.string('email')
    t.string('password')
    t.timestamps(false, true) // [useTimestamps], [defaultToNow]
  })

exports.down = knex =>
  knex.schema.dropTable('users')
