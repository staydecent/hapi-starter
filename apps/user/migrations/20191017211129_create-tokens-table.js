
exports.up = knex =>
  knex.schema.createTable('tokens', t => {
    t.increments('id').primary()
    t.string('key')
    t.integer('user').unsigned().notNullable()
    t.foreign('user').references('id').inTable('users')
    t.timestamps(false, true) // [useTimestamps], [defaultToNow]
  })

exports.down = knex =>
  knex.schema.dropTable('tokens')
