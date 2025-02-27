const Task = function (task) {
  this.task = task.task
  this.created_at = new Date()
}

const { generateQuery, mapToCondition } = require("@/utils/db-helper")

Task.getTasktypeBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let condition = mapToCondition(data)

  const { filter, pagination, sort } = generateQuery(data)

  const core_query = `SELECT *
    FROM tb_tasktype AS tb
    WHERE TRUE
    ${condition}
    ${filter}
  `
  const count_query = `SELECT COUNT(*) AS total FROM (${core_query}) AS tb`

  if (data.count) return connection.query(count_query, function (err, res_total) {
    err ? reject(new Error(err.message)) : resolve(res_total[0].total)
  })

  connection.query(`${core_query} ${sort} ${pagination}`, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!pagination) return resolve({ docs: res, totalDocs: res.length })

    connection.query(count_query, function (err, res_total) {
      err ? reject(new Error(err.message)) : resolve({ docs: res, totalDocs: res_total[0].total })
    })
  })
})

Task.getTasktypeByID = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `SELECT *
    FROM tb_tasktype AS tb
    WHERE tasktype_id = ${connection.escape(data.tasktype_id)}
    `
  connection.query(sql, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!res.length) return data.required === false ? resolve() : reject(new Error('Not Found'))

    resolve(res[0])
  })
})

Task.insertTasktype = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `INSERT INTO tb_tasktype (
    tasktype_id, 
    tasktype_name, 
    tasktype_color, 
    addby, 
    adddate,
    sort
  ) VALUES (
    ${connection.escape(data.tasktype_id)},
    ${connection.escape(data.tasktype_name)},
    ${connection.escape(data.tasktype_color)},
    ${connection.escape(connection.session._id)},
    NOW(),
    ${connection.escape(data.sort)}
  )`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.updateTasktypeBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `UPDATE tb_tasktype SET 
    tasktype_id = ${connection.escape(data.tasktype_id)},
    tasktype_name = ${connection.escape(data.tasktype_name)},
    tasktype_color = ${connection.escape(data.tasktype_color)},
    sort = ${connection.escape(data.sort)}
    WHERE tasktype_id = ${connection.escape(data.tasktype_id)}
  `
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.deleteTasktypeBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `DELETE FROM tb_tasktype WHERE tasktype_id = ${connection.escape(data.tasktype_id)} `

  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

module.exports = Task