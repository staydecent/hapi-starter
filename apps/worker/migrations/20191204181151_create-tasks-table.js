
exports.up = knex =>
  knex.schema.createTable('tasks', t => {
    t.increments('id').primary()
    t.timestamps(false, true) // [useTimestamps], [defaultToNow]
    t.string('handler')
    t.string('args')
    t.string('error')
    t.integer('interval')
    t.enum(
      'status',
      ['waiting', 'completed', 'failed'],
      { useNative: true, enumName: 'status_type' }
     )
    t.datetime('completed_at')
  })

exports.down = knex =>
  knex.schema.dropTable('tasks')
