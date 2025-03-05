const Task = function (task) {
  this.task = task.task
  this.created_at = new Date()
}

const { formatDate } = require('@/utils/date-helper')
const { generateQuery, mapToCondition } = require("@/utils/db-helper")

Task.generateEmployeeID = (connection) => new Promise((resolve, reject) => {
  let code = `EM${formatDate(new Date(), 'yyyyMMdd')}-`
  let digit = 4

  let sql = `SELECT CONCAT(${connection.escape(code)}, LPAD(IFNULL(MAX(CAST(SUBSTRING(employee_id,${(code.length + 1)},${digit}) AS SIGNED)),0) + 1,${digit},0)) AS id 
    FROM tb_employee
    WHERE employee_id LIKE (${connection.escape(`${code}%`)}) 
    `
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res[0].id) })
})

Task.getEmployeeBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let condition = mapToCondition(data)

  const { filter, pagination, sort } = generateQuery(data)

  const core_query = `SELECT employee_id, 
    employee_username, 
    employee_password, 
    employee_prefix, 
    employee_firstname, 
    employee_lastname, 
    employee_email, 
    employee_phone, 
    employee_birthday, 
    employee_gender, 
    employee_address,
    employee_img,
    license_id, 
    addby, 
    adddate, 
    updateby, 
    lastupdate,
    CONCAT(employee_firstname, ' ', employee_lastname) AS employee_fullname,
    IFNULL((
      SELECT license_name
      FROM tb_license 
      WHERE license_id = tb.license_id
    ), tb.license_id) AS license_name
    FROM tb_employee AS tb
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

Task.getEmployeeByID = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `SELECT employee_id, 
    employee_username, 
    employee_password, 
    employee_prefix, 
    employee_firstname, 
    employee_lastname, 
    employee_email, 
    employee_phone, 
    employee_birthday, 
    employee_gender, 
    employee_address,
    employee_img,
    license_id, 
    addby, 
    adddate, 
    updateby, 
    lastupdate,
    CONCAT(employee_firstname, ' ', employee_lastname) AS employee_fullname,
    IFNULL((
      SELECT license_name
      FROM tb_license 
      WHERE license_id = tb.license_id
    ), tb.license_id) AS license_name
    FROM tb_employee AS tb
    WHERE employee_id = ${connection.escape(data.employee_id)}
    `
  connection.query(sql, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!res.length) return data.required === false ? resolve() : reject(new Error('Not Found'))

    resolve(res[0])
  })
})

Task.getEmployeeCredentialByID = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `SELECT * FROM tb_employee WHERE employee_id = ${connection.escape(data.employee_id)} `

  connection.query(sql, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!res.length) return reject(new Error('Invalid credential'))

    resolve(res[0])
  })
})

Task.checkLogin = (connection, data = {}) => new Promise((resolve, reject) => {
  let condition = ''
  if ('employee_id' in data) {
    condition += `AND employee_id = ${connection.escape(data.employee_id)} `
  } else {
    condition += `AND employee_username = ${connection.escape(data.employee_username)} 
      AND employee_password = ${connection.escape(data.employee_password)} `
  }

  let sql = `SELECT employee_id,
       license_id,
       employee_firstname,
       employee_lastname,
       employee_username,
       employee_img
      FROM tb_employee
      WHERE TRUE
    ${condition}`

  connection.query(sql, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!res.length) return reject(new Error('Invalid Employeename or Password'))

    resolve(res[0])
  })
})

Task.insertEmployee = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `INSERT INTO tb_employee (
    employee_id,
    employee_username,
    employee_password,
    employee_prefix,
    employee_firstname,
    employee_lastname,
    employee_email,
    employee_phone,
    employee_birthday,
    employee_gender,
    employee_address,
    employee_img,
    license_id,
    addby,
    adddate
) VALUES (
    ${connection.escape(data.employee_id)}, 
    ${connection.escape(data.employee_username)},
    ${connection.escape(data.employee_password)},
    ${connection.escape(data.employee_prefix)},
    ${connection.escape(data.employee_firstname)},
    ${connection.escape(data.employee_lastname)},
    ${connection.escape(data.employee_email)},
    ${connection.escape(data.employee_phone)},
    ${connection.escape(data.employee_birthday)}, 
    ${connection.escape(data.employee_gender)},
    ${connection.escape(data.employee_address)},
    ${connection.escape(data.employee_img)},
    ${connection.escape(data.license_id)},
    ${connection.escape(connection.session._id)},
    NOW()
  )`

  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.register = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `INSERT INTO tb_employee (
    employee_id, 
    employee_username, 
    employee_password, 
    employee_prefix, 
    employee_firstname, 
    employee_lastname, 
    employee_email, 
    employee_phone, 
    employee_birthday, 
    employee_gender, 
    employee_address,
    employee_img, 
    license_id, 
    addby, 
    adddate,  
  ) VALUES (
    ${connection.escape(data.employee_id)}, 
    ${connection.escape(data.employee_username)},
    ${connection.escape(data.employee_password)},
    ${connection.escape(data.employee_prefix)},
    ${connection.escape(data.employee_firstname)},
    ${connection.escape(data.employee_lastname)},
    ${connection.escape(data.employee_email)},
    ${connection.escape(data.employee_phone)},
    ${connection.escape(data.employee_birthday)}, 
    ${connection.escape(data.employee_gender)},
    ${connection.escape(data.employee_address)},
    ${connection.escape(data.license_id)},
    ' ',
    NOW()
  )`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.updateEmployeeBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `UPDATE tb_employee SET 
    employee_username = ${connection.escape(data.employee_username)},
    employee_password = ${connection.escape(data.employee_password)},
    employee_prefix = ${connection.escape(data.employee_prefix)},
    employee_firstname = ${connection.escape(data.employee_firstname)},
    employee_lastname = ${connection.escape(data.employee_lastname)},
    employee_email = ${connection.escape(data.employee_email)},
    employee_phone = ${connection.escape(data.employee_phone)},
    employee_birthday = ${connection.escape(data.employee_birthday)},
    employee_gender = ${connection.escape(data.employee_gender)}, 
    employee_address = ${connection.escape(data.employee_address)}, 
    employee_img = ${connection.escape(data.employee_img)}, 
    license_id = ${connection.escape(data.license_id)}, 
    updateby = ${connection.escape(connection.session._id)},
    lastupdate = NOW()
    WHERE employee_id = ${connection.escape(data.employee_id)}
  `
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

Task.deleteEmployeeBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `DELETE FROM tb_employee WHERE employee_id = ${connection.escape(data.employee_id)} `

  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

module.exports = Task