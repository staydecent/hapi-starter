
exports.up = function (knex) {
  return knex.schema.createTable('tokens', function (table) {
    table.increments('id').primary()
    table.string('key')
    table.integer('user').unsigned().notNullable()
    table.foreign('user').references('id').inTable('users')
    table.timestamps()
  }) 
}

exports.down = function (knex) {
  return knex.schema.dropTable('tokens')
}
