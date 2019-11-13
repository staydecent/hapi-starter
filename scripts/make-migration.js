const path = require('path')
const fs = require('fs')

const [app, name] = process.argv.slice(2)

if (!app || !name) {
  console.log('Please provide the app and migration name.')
  process.exit(1)
}

const dir = path.resolve(__dirname, '../apps/', app, 'migrations')

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

const file = path.resolve(dir, yyyymmddhhmmss() + '_' + name + '.js')
const template = `
exports.up = knex =>
  knex.schema.createTable('myTable', t => {
    t.increments('id').primary()
    t.timestamps(false, true) // [useTimestamps], [defaultToNow]
  })

exports.down = knex =>
  knex.schema.dropTable('myTable')
`

try {
  fs.writeFileSync(file, template)
  process.exit(0)
} catch (err) {
  console.error(err)
  process.exit(1)
}

function padDate (segment) {
  segment = segment.toString()
  return segment[1] ? segment : `0${segment}`
}

function yyyymmddhhmmss () {
  const d = new Date()
  return (
    d.getFullYear().toString() +
    padDate(d.getMonth() + 1) +
    padDate(d.getDate()) +
    padDate(d.getHours()) +
    padDate(d.getMinutes()) +
    padDate(d.getSeconds())
  )
}
