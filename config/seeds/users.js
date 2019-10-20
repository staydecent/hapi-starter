
exports.seed = function (knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        { email: 'user1@example.org' },
        { email: 'user2@example.org' },
        { email: 'user3@example.org' }
      ])
    })
}
