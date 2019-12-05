## Migrations

`npm run migrate:make worker create-tasks-table`

Creates the file: `apps/worker/migrations/20191204181151_create-tasks-table.js` with the following snippet as a starting point:

```javascript
exports.up = knex =>
  knex.schema.createTable('myTable', t => {
    t.increments('id').primary()
    t.timestamps(false, true) // [useTimestamps], [defaultToNow]
  })

exports.down = knex =>
  knex.schema.dropTable('myTable')
```
