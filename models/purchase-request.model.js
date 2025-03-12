const Task = function (task) {
    this.task = task.task
    this.created_at = new Date()
}

const { formatDate } = require('@/utils/date-helper')
const { generateQuery, mapToCondition } = require("@/utils/db-helper")

Task.generatePurchaseRequestID = (connection) => new Promise((resolve, reject) => {
    let code = `ST-IN${formatDate(new Date(), 'yyyyMMdd')}-`
    let digit = 3

    let sql = `SELECT CONCAT(${connection.escape(code)}, LPAD(IFNULL(MAX(CAST(SUBSTRING(pr_id,${(code.length + 1)},${digit}) AS SIGNED)),0) + 1,${digit},0)) AS id 
          FROM tb_purchase_request
          WHERE pr_id LIKE (${connection.escape(`${code}%`)}) 
      `
    connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res[0].id) })
})

Task.getPurchaseRequestByID = (connection, data = {}) => new Promise((resolve, reject) => {
    let sql = `SELECT * FROM tb_purchase_request
      WHERE pr_id = ${connection.escape(data.pr_id)}
      `
    connection.query(sql, function (err, res) {
        if (err) return reject(new Error(err.message))
        if (!res.length) return data.required === false ? resolve() : reject(new Error('Not Found'))

        resolve(res[0])
    })
})

Task.insertPurchaseRequest = (connection, data = {}) => new Promise((resolve, reject) => {
    let sql = `INSERT INTO tb_purchase_request (
      pr_id,
      pr_status,
      pr_note,
      product,
      material,
      addby,
      adddate
    ) VALUES (
      ${connection.escape(data.pr_id)},
      ${connection.escape(data.pr_status)}, 
      ${connection.escape(data.pr_note)}, 
      ${connection.escape(data.product)}, 
      ${connection.escape(data.material)}, 
      ${connection.escape(connection.session._id)},
      NOW()
    )`
    connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})