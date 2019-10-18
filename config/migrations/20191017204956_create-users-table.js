
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary()
    table.string('email')
    table.string('password')
    table.timestamps()
  }) 
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
