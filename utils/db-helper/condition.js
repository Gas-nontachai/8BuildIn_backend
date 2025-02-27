const mysql = require('mysql')

const logicals = {
  '$and': 'AND',
  '$or': 'OR',
  '$not': 'NOT',
  '$nor': 'OR NOT',
}

function mapToCondition({ match }) {
  const conditions = mapLogical(match)

  const condition = conditions.join(` AND `)

  return conditions.length ? `AND ${condition} ` : ''
}

function mapLogical(data) {
  const conditions = []

  for (const key in data) {
    const value = data[key]
    const logic = logicals[key]

    if (logic && value instanceof Array) {
      const nesteds = []

      value.forEach(val => {
        const sup_logics = mapLogical(val)

        if (sup_logics.length) nesteds.push(...sup_logics)
      })

      if (!nesteds.length) continue

      const nested_condition = nesteds.join(` ${logic} `)

      conditions.push(`(${nested_condition})`)
    } else {
      const { condition, err } = mapCompare(key, value)

      if (!err) conditions.push(condition)
    }
  }

  return conditions
}

function mapCompare(key, value, main) {
  const field = main || key;

  const compares = {
    '$gt': (v) => `${field} > ${mysql.escape(v)}`,
    '$gte': (v) => `${field} >= ${mysql.escape(v)}`,
    '$lt': (v) => `${field} < ${mysql.escape(v)}`,
    '$lte': (v) => `${field} <= ${mysql.escape(v)}`,
    '$in': (v) => `${field} IN ('${(v || []).join("','")}')`,
    '$nin': (v) => `${field} NOT IN ('${(v || []).join("','")}')`,
    '$ne': (v) => v === null ? `${field} IS NOT NULL` : `${field} != ${mysql.escape(v)}`,
    '$eq': (v) => v === null ? `${field} IS NULL` : `${field} = ${mysql.escape(v)}`,
  };

  if (!(value instanceof Object)) {
    return { condition: compares.$eq(value), err: false };
  }

  const { $skip, ...conditions } = value;
  const compare_stacks = Object.keys(conditions)
    .filter((key) => key in compares)
    .map((key) => compares[key](conditions[key]));

  return {
    skip: $skip,
    condition: compare_stacks.length ? compare_stacks.join(' AND ') : '',
    err: !compare_stacks.length,
  };
}

module.exports = {
  mapToCondition,
  mapCompare,
}