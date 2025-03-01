const Task = function (task) {
  this.task = task.task
  this.created_at = new Date()
}

const { formatDate } = require('@/utils/date-helper')
const { generateQuery, mapToCondition } = require("@/utils/db-helper")

Task.generateMaterialID = (connection) => new Promise((resolve, reject) => {
  let code = `MT${formatDate(new Date(), 'yyyyMMdd')}-`
  let digit = 3

  let sql = `SELECT CONCAT(${connection.escape(code)}, LPAD(IFNULL(MAX(CAST(SUBSTRING(material_id,${(code.length + 1)},${digit}) AS SIGNED)),0) + 1,${digit},0)) AS id 
		FROM tb_material
		WHERE material_id LIKE (${connection.escape(`${code}%`)}) 
	`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res[0].id) })
})

Task.getMaterialBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let condition = mapToCondition(data)
  const { filter, pagination, sort, group } = generateQuery(data)

  const core_query = `SELECT *
    FROM tb_material AS tb
    WHERE TRUE
    ${condition}
    ${filter} 
  `
  const count_query = `SELECT COUNT(*) AS total FROM (${core_query}) AS tb`
  console.log(core_query);

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

Task.getMaterialByID = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `SELECT * FROM tb_material
    WHERE material_id = ${connection.escape(data.material_id)}
    `
  connection.query(sql, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!res.length) return data.required === false ? resolve() : reject(new Error('Not Found'))

    resolve(res[0])
  })
})

Task.insertMaterial = (connection, data = {}) => new Promise((resolve, reject) => {
  const sql = `
  INSERT INTO tb_material (
    material_id, 
    material_category_id, 
    material_name, 
    material_quantity, 
    material_price, 
    unit_id,  
    material_img, 
    stock_in_id, 
    addby, 
    adddate
  ) 
  VALUES (
    ${connection.escape(data.material_id)},
    ${connection.escape(data.material_category_id)}, 
    ${connection.escape(data.material_name)},
    ${connection.escape(data.material_quantity)},
    ${connection.escape(data.material_price)},   
    ${connection.escape(data.unit_id)},
    ${connection.escape(data.material_img)},
    ${connection.escape(data.stock_in_id)},
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

Task.updateMaterialBy = (connection, data = {}) => new Promise((resolve, reject) => {
  const sql = `
  UPDATE tb_material SET    
    material_category_id = ${connection.escape(data.material_category_id)}, 
    material_name = ${connection.escape(data.material_name)},
    material_quantity = ${connection.escape(data.material_quantity)},
    material_price = ${connection.escape(data.material_price)},
    unit_id = ${connection.escape(data.unit_id)},
    material_img = ${connection.escape(data.material_img)},
    stock_in_id = ${connection.escape(data.stock_in_id)},
    updateby = 'admin',
    lastupdate = NOW()
  WHERE material_id = ${connection.escape(data.material_id)}
`;

  connection.query(sql, (err, res) => {
    if (err) {
      reject(new Error(err.message));
    } else {
      resolve(res);
    }
  });
});

Task.deleteMaterialBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `DELETE FROM tb_material WHERE material_id = ${connection.escape(data.material_id)} `

  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

module.exports = Task