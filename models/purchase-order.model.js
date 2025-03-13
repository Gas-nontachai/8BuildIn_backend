const Task = function (task) {
  this.task = task.task
  this.created_at = new Date()
}

const { formatDate } = require('@/utils/date-helper')
const { generateQuery, mapToCondition } = require("@/utils/db-helper")

Task.generatePurchaseOrderID = (connection) => new Promise((resolve, reject) => {
  let code = `PO${formatDate(new Date(), 'yyyyMMdd')}-`
  let digit = 3

  let sql = `SELECT CONCAT(${connection.escape(code)}, LPAD(IFNULL(MAX(CAST(SUBSTRING(po_id,${(code.length + 1)},${digit}) AS SIGNED)),0) + 1,${digit},0)) AS id 
		FROM tb_purchase_order
		WHERE po_id LIKE (${connection.escape(`${code}%`)}) 
	`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res[0].id) })
})

Task.getPurchaseOrderBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let condition = mapToCondition(data)
  const { filter, pagination, sort, group } = generateQuery(data)

  const core_query = `SELECT *
    FROM tb_purchase_order AS tb
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

Task.getPurchaseOrderByID = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `SELECT * FROM tb_purchase_order
    WHERE po_id = ${connection.escape(data.po_id)}
    `
  connection.query(sql, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!res.length) return data.required === false ? resolve() : reject(new Error('Not Found'))

    resolve(res[0])
  })
})

Task.insertPurchaseOrder = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `INSERT INTO tb_purchase_order (
    po_id, 
    pr_id, 
    supplier_id, 
    product, 
    material, 
    po_status, 
    po_note, 
    addby,
    adddate
  ) VALUES (
    ${connection.escape(data.po_id)},
    ${connection.escape(data.pr_id)}, 
    ${connection.escape(data.supplier_id)},
    ${connection.escape(data.product)},
    ${connection.escape(data.material)},
    ${connection.escape(data.po_status)},
    ${connection.escape(data.po_note)}, 
    ${connection.escape(connection.session._id)},
    NOW()
  )`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.updatePurchaseOrderBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `UPDATE tb_purchase_order SET    
  pr_id = ${connection.escape(data.pr_id)}, 
  supplier_id = ${connection.escape(data.supplier_id)},
  po_status = ${connection.escape(data.po_status)},
  po_note = ${connection.escape(data.po_note)},
  product = ${connection.escape(data.product)},
  material = ${connection.escape(data.material)},
  updateby = ${connection.escape(connection.session._id)},
  lastupdate = NOW()
  WHERE po_id = ${connection.escape(data.po_id)}
  `
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.deletePurchaseOrderBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `DELETE FROM tb_purchase_order WHERE po_id = ${connection.escape(data.po_id)} `
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

module.exports = Task