const Task = function (task) {
  this.task = task.task
  this.created_at = new Date()
}

const { formatDate } = require('@/utils/date-helper')
const { generateQuery, mapToCondition } = require("@/utils/db-helper")

Task.generateSupplierID = (connection) => new Promise((resolve, reject) => {
  let code = `SP${formatDate(new Date(), 'yyyyMMdd')}-`
  let digit = 3

  let sql = `SELECT CONCAT(${connection.escape(code)}, LPAD(IFNULL(MAX(CAST(SUBSTRING(supplier_id,${(code.length + 1)},${digit}) AS SIGNED)),0) + 1,${digit},0)) AS id 
		FROM tb_supplier
		WHERE supplier_id LIKE (${connection.escape(`${code}%`)}) 
	`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res[0].id) })
})

Task.getSupplierBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let condition = mapToCondition(data)
  const { filter, pagination, sort, group } = generateQuery(data)

  const core_query = `SELECT *
    FROM tb_supplier AS tb
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

Task.getSupplierByID = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `SELECT * FROM tb_supplier
    WHERE supplier_id = ${connection.escape(data.supplier_id)}
    `
  connection.query(sql, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!res.length) return data.required === false ? resolve() : reject(new Error('Not Found'))

    resolve(res[0])
  })
})

Task.insertSupplier = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `INSERT INTO tb_supplier (
    supplier_id, 
    supplier_name,
    supplier_contact,
    addby,
    adddate
  ) VALUES (
    ${connection.escape(data.supplier_id)},
    ${connection.escape(data.supplier_name)}, 
    ${connection.escape(data.supplier_contact)}, 
    'admin',
    NOW()
  )`
   connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.updateSupplierBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `UPDATE tb_supplier SET    
  supplier_name = ${connection.escape(data.supplier_name)},
  supplier_contact = ${connection.escape(data.supplier_contact)}, 
  updateby = 'admin',
  lastupdate = NOW() 
  WHERE supplier_id = ${connection.escape(data.supplier_id)}
  `
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.deleteSupplierBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `DELETE FROM tb_supplier WHERE supplier_id = ${connection.escape(data.supplier_id)} `

  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

module.exports = Task