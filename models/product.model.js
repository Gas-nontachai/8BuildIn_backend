const Task = function (task) {
  this.task = task.task
  this.created_at = new Date()
}

const { formatDate } = require('@/utils/date-helper')
const { generateQuery, mapToCondition } = require("@/utils/db-helper")

Task.generateProductID = (connection) => new Promise((resolve, reject) => {
  let code = `PD${formatDate(new Date(), 'yyyyMMdd')}-`
  let digit = 3

  let sql = `SELECT CONCAT(${connection.escape(code)}, LPAD(IFNULL(MAX(CAST(SUBSTRING(product_id,${(code.length + 1)},${digit}) AS SIGNED)),0) + 1,${digit},0)) AS id 
		FROM tb_product
		WHERE product_id LIKE (${connection.escape(`${code}%`)}) 
	`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res[0].id) })
})

Task.getProductBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let condition = mapToCondition(data)
  const { filter, pagination, sort, group } = generateQuery(data)

  const core_query = `SELECT *
    FROM tb_product AS tb
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

Task.getProductByID = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `SELECT * FROM tb_product
    WHERE product_id = ${connection.escape(data.product_id)}
    `
  connection.query(sql, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!res.length) return data.required === false ? resolve() : reject(new Error('Not Found'))

    resolve(res[0])
  })
})

Task.insertProduct = (connection, data = {}) => new Promise((resolve, reject) => {
  const sql = `
    INSERT INTO tb_product (
      product_id, 
      product_category_id, 
      product_name, 
      product_quantity, 
      product_price,
      unit_id, 
      material, 
      product_img, 
      stock_in_id, 
      addby, 
      adddate
    ) 
    VALUES (
      ${connection.escape(data.product_id)},
      ${connection.escape(data.product_category_id)}, 
      ${connection.escape(data.product_name)},
      ${connection.escape(data.product_quantity)},
      ${connection.escape(data.product_price)},
      ${connection.escape(data.unit_id)},
      ${connection.escape(data.material)},
      ${connection.escape(data.product_img)},
      ${connection.escape(data.stock_in_id)},
      ${connection.escape(connection.session._id)}, 
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

Task.updateProductBy = (connection, data = {}) => new Promise((resolve, reject) => {
  const sql = `
    UPDATE tb_product SET    
      product_category_id = ${connection.escape(data.product_category_id)}, 
      product_name = ${connection.escape(data.product_name)},
      product_quantity = ${connection.escape(data.product_quantity)},
      product_price = ${connection.escape(data.product_price)},
      unit_id = ${connection.escape(data.unit_id)},
      material = ${connection.escape(data.material)},
      product_img = ${connection.escape(data.product_img)},
      stock_in_id = ${connection.escape(data.stock_in_id)},
      updateby = ${connection.escape(connection.session._id)},
      lastupdate = NOW()
    WHERE product_id = ${connection.escape(data.product_id)}
`;

  connection.query(sql, (err, res) => {
    if (err) {
      reject(new Error(err.message));
    } else {
      resolve(res);
    }
  });
});

Task.deleteProductBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `DELETE FROM tb_product WHERE product_id = ${connection.escape(data.product_id)} `

  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

module.exports = Task