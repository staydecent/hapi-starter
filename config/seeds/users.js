
exports.seed = function (knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        { id: 2, email: 'user1@example.org' },
        { id: 3, email: 'user2@example.org' },
        { id: 1, email: 'user3@example.org' }
      ])
    })
}
