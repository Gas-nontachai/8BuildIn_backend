const Task = function (task) {
  this.task = task.task
  this.created_at = new Date()
}

const { generateQuery, mapToCondition } = require("@/utils/db-helper")

Task.generateMenuID = (connection) => new Promise((resolve, reject) => {
  let code = `MN`
  let digit = 3

  let sql = `SELECT CONCAT(${connection.escape(code)}, LPAD(IFNULL(MAX(CAST(SUBSTRING(menu_id,${(code.length + 1)},${digit}) AS SIGNED)),0) + 1,${digit},0)) AS id 
		FROM tb_menu
		WHERE menu_id LIKE (${connection.escape(`${code}%`)}) 
	`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res[0].id) })
})

Task.getMenuBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let condition = mapToCondition(data)
  const { filter, pagination, sort, group } = generateQuery(data)

  const core_query = `SELECT *
    FROM tb_menu AS tb
    WHERE TRUE
    ${condition}
    ${filter} 
  `
  const count_query = `SELECT COUNT(*) AS total FROM (${core_query}) AS tb`

  if (data.count) return connection.query(count_query, function (err, res_total) {
    err ? reject(new Error(err.message)) : resolve(res_total[0].total)
  })

  connection.query(`${core_query} ${group} ${sort} ${pagination}`, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!pagination) return resolve({ docs: res, totalDocs: res.length })

    connection.query(count_query, function (err, res_total) {
      err ? reject(new Error(err.message)) : resolve({ docs: res, totalDocs: res_total[0].total })
    })
  })
})

Task.getMenuByID = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `SELECT * FROM tb_menu
    WHERE menu_id = ${connection.escape(data.menu_id)}
    `
  connection.query(sql, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!res.length) return data.required === false ? resolve() : reject(new Error('Not Found'))

    resolve(res[0])
  })
})

Task.getMenuPermissionBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `SELECT tb.menu_id,
    menu_group,
    menu_name_th,
    menu_name_en,
    IFNULL(permission_view, FALSE) AS permission_view,
    IFNULL(permission_add, FALSE) AS permission_add,
    IFNULL(permission_edit, FALSE) AS permission_edit,
    IFNULL(permission_approve, FALSE) AS permission_approve,
    IFNULL(permission_cancel, FALSE) AS permission_cancel,
    IFNULL(permission_delete, FALSE) AS permission_delete,
    IFNULL(permission_print, FALSE) AS permission_print
    FROM tb_menu AS tb
    LEFT JOIN tb_permission ON tb.menu_id = tb_permission.menu_id AND license_id = ${connection.escape(data.license_id || '')}
    ORDER BY menu_group, tb.menu_id
  `
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.insertMenu = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `INSERT INTO tb_menu (
    menu_id, 
    menu_name_th,
    menu_name_en, 
    menu_group
  ) VALUES (
    ${connection.escape(data.menu_id)},
    ${connection.escape(data.menu_name_th)},
    ${connection.escape(data.menu_name_en)},
    ${connection.escape(data.menu_group)} 
  )`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.updateMenuBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `UPDATE tb_menu SET    
  menu_name_th = ${connection.escape(data.menu_name_th)},
  menu_name_en = ${connection.escape(data.menu_name_en)},
  menu_group = ${connection.escape(data.menu_group)}
    WHERE menu_id = ${connection.escape(data.menu_id)}
  `
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.deleteMenuBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `DELETE FROM tb_menu WHERE menu_id = ${connection.escape(data.menu_id)} `

  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

module.exports = Task