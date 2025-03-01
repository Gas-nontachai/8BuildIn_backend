const Task = function (task) {
  this.task = task.task
  this.created_at = new Date()
}

const { formatDate } = require('@/utils/date-helper')
const { generateQuery, mapToCondition } = require("@/utils/db-helper")

Task.generateStockOutID = (connection) => new Promise((resolve, reject) => {
  let code = `ST-OUT${formatDate(new Date(), 'yyyyMMdd')}-`
  let digit = 3

  let sql = `SELECT CONCAT(${connection.escape(code)}, LPAD(IFNULL(MAX(CAST(SUBSTRING(stock_out_id,${(code.length + 1)},${digit}) AS SIGNED)),0) + 1,${digit},0)) AS id 
		FROM tb_stock_out
		WHERE stock_out_id LIKE (${connection.escape(`${code}%`)}) 
	`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res[0].id) })
})

Task.getStockOutBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let condition = mapToCondition(data)
  const { filter, pagination, sort, group } = generateQuery(data)

  const core_query = `SELECT *
    FROM tb_stock_out AS tb
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

Task.getStockOutByID = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `SELECT * FROM tb_stock_out
    WHERE stock_out_id = ${connection.escape(data.stock_out_id)}
    `
  connection.query(sql, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!res.length) return data.required === false ? resolve() : reject(new Error('Not Found'))

    resolve(res[0])
  })
})

Task.insertStockOut = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `INSERT INTO tb_stock_out (
    stock_out_id, 
    product, 
    material, 
    stock_in_price, 
    supplier_id, 
    stock_in_date, 
    addby, 
    adddate
  ) VALUES (
    ${connection.escape(data.stock_out_id)},
    ${connection.escape(data.product)}, 
    ${connection.escape(data.material)}, 
    ${connection.escape(data.stock_in_price)}, 
    ${connection.escape(data.supplier_id)}, 
    ${connection.escape(data.stock_in_date)}, 
    'admin',
    NOW()
  )`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.updateStockOutBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `UPDATE tb_stock_out SET    
  product = ${connection.escape(data.product)},
  material = ${connection.escape(data.material)}, 
  stock_in_price = ${connection.escape(data.stock_in_price)}, 
  supplier_id = ${connection.escape(data.supplier_id)}, 
  stock_in_date = ${connection.escape(data.stock_in_date)},  
  updateby = 'admin',
  lastupdate = NOW() 
  WHERE stock_out_id = ${connection.escape(data.stock_out_id)}
  `
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.deleteStockOutBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `DELETE FROM tb_stock_out WHERE stock_out_id = ${connection.escape(data.stock_out_id)} `

  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

module.exports = Task