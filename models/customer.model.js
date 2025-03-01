const Task = function (task) {
  this.task = task.task
  this.created_at = new Date()
}

const { formatDate } = require('@/utils/date-helper')
const { generateQuery, mapToCondition } = require("@/utils/db-helper")

Task.generateCustomerID = (connection) => new Promise((resolve, reject) => {
  let code = `CUS${formatDate(new Date(), 'yyyyMMdd')}-`
  let digit = 3

  let sql = `SELECT CONCAT(${connection.escape(code)}, LPAD(IFNULL(MAX(CAST(SUBSTRING(customer_id,${(code.length + 1)},${digit}) AS SIGNED)),0) + 1,${digit},0)) AS id 
		FROM tb_customer
		WHERE customer_id LIKE (${connection.escape(`${code}%`)}) 
	`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res[0].id) })
})

Task.getCustomerBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let condition = mapToCondition(data)
  const { filter, pagination, sort, group } = generateQuery(data)

  const core_query = `SELECT *
    FROM tb_customer AS tb
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

Task.getCustomerByID = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `SELECT * FROM tb_customer
    WHERE customer_id = ${connection.escape(data.customer_id)}
    `
  connection.query(sql, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!res.length) return data.required === false ? resolve() : reject(new Error('Not Found'))

    resolve(res[0])
  })
})

Task.insertCustomer = (connection, data = {}) => new Promise((resolve, reject) => {
  const sql = `
    INSERT INTO tb_customer (
      customer_id, 
      customer_prefix, 
      customer_firstname, 
      customer_lastname, 
      customer_email, 
      customer_phone, 
      customer_birthday, 
      customer_gender, 
      customer_address, 
      addby, 
      adddate
    ) 
    VALUES (
      ${connection.escape(data.customer_id)},
      ${connection.escape(data.customer_prefix)},
      ${connection.escape(data.customer_firstname)},
      ${connection.escape(data.customer_lastname)},
      ${connection.escape(data.customer_email)},
      ${connection.escape(data.customer_phone)},
      ${connection.escape(data.customer_birthday)},
      ${connection.escape(data.customer_gender)},
      ${connection.escape(data.customer_address)},
      'admin',
      NOW() 
    )
  `;

  connection.query(sql, (err, res) => {
    if (err) {
      reject(new Error(err.message));
    } else {
      resolve(res);
    }
  });
});

Task.updateCustomerBy = (connection, data = {}) => new Promise((resolve, reject) => {
  const sql = `
    UPDATE tb_customer SET    
      customer_prefix = ${connection.escape(data.customer_prefix)},
      customer_firstname = ${connection.escape(data.customer_firstname)},
      customer_lastname = ${connection.escape(data.customer_lastname)},
      customer_email = ${connection.escape(data.customer_email)},
      customer_phone = ${connection.escape(data.customer_phone)},
      customer_birthday = ${connection.escape(data.customer_birthday)},
      customer_gender = ${connection.escape(data.customer_gender)},
      customer_address = ${connection.escape(data.customer_address)}, 
      updateby = 'admin',
      lastupdate = NOW()
    WHERE customer_id = ${connection.escape(data.customer_id)}
  `;

  connection.query(sql, (err, res) => {
    if (err) {
      reject(new Error(err.message));
    } else {
      resolve(res);
    }
  });
});

Task.deleteCustomerBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `DELETE FROM tb_customer WHERE customer_id = ${connection.escape(data.customer_id)} `

  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

module.exports = Task