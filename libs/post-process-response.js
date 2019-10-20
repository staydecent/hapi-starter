const check = require('check-arg-types')
const toType = check.prototype.toType

function convertToCamel (row) {
  if (toType(row) !== 'object') {
    return row
  }
  const newRow = {}
  for (const key in row) {
    let ret = ''
    let prevUnderscore = false
    for (const s of key) {
      const isUnderscore = s === '_'
      if (isUnderscore) {
        prevUnderscore = true
        continue
      }
      if (!isUnderscore && prevUnderscore) {
        ret += s.toUpperCase()
        prevUnderscore = false
      } else {
        ret += s.toLowerCase()
      }
    }
    newRow[ret] = row[key]
  }
  return newRow
}

const postProcessResponse = (result, queryContext) => {
  if (Array.isArray(result)) {
    return result.map(row => convertToCamel(row))
  } else {
    return convertToCamel(result)
  }
}

module.exports = postProcessResponse
