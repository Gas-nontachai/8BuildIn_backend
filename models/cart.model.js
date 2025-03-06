const Task = function (task) {
  this.task = task.task
  this.created_at = new Date()
}

const { formatDate } = require('@/utils/date-helper')
const { generateQuery, mapToCondition } = require("@/utils/db-helper")

Task.generateCartID = (connection) => new Promise((resolve, reject) => {
  let code = `C${formatDate(new Date(), 'yyyyMMdd')}-`
  let digit = 3

  let sql = `SELECT CONCAT(${connection.escape(code)}, LPAD(IFNULL(MAX(CAST(SUBSTRING(cart_id,${(code.length + 1)},${digit}) AS SIGNED)),0) + 1,${digit},0)) AS id 
		FROM tb_cart
		WHERE cart_id LIKE (${connection.escape(`${code}%`)}) 
	`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res[0].id) })
})

Task.getCartBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let condition = mapToCondition(data)
  const { filter, pagination, sort, group } = generateQuery(data)

  const core_query = `SELECT *
    FROM tb_cart AS tb
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

Task.getCartByID = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `SELECT * FROM tb_cart
    WHERE cart_id = ${connection.escape(data.cart_id)}
    `
  connection.query(sql, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!res.length) return data.required === false ? resolve() : reject(new Error('Not Found'))

    resolve(res[0])
  })
})

Task.insertCart = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `INSERT INTO tb_cart (
    cart_id, 
    cart_amount,
    cart_status,
    product_id,
    addby,
    adddate
  ) VALUES (
    ${connection.escape(data.cart_id)},
    ${connection.escape(data.cart_amount)}, 
    ${connection.escape(data.cart_status)}, 
    ${connection.escape(data.product_id)}, 
    ${connection.escape(connection.session._id)},
    NOW()
  )`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.updateCartBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `UPDATE tb_cart SET    
  cart_amount = ${connection.escape(data.cart_amount)},
  cart_status = ${connection.escape(data.cart_status)}
  WHERE cart_id = ${connection.escape(data.cart_id)}
  `
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.deleteCartBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `DELETE FROM tb_cart WHERE cart_id = ${connection.escape(data.cart_id)} `

  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

module.exports = Task