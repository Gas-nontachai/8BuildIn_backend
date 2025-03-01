const mysql = require('mysql2')

const pool = mysql.createPool({
  connectionLimit: 30,
  charset: 'utf8mb4',
  multipleStatements: true,
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

module.exports = () => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) return reject(new Error(err.message))

    connection.session = null
    resolve(connection)
  })
})
