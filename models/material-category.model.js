const Task = function (task) {
  this.task = task.task
  this.created_at = new Date()
}

const { formatDate } = require('@/utils/date-helper')
const { generateQuery, mapToCondition } = require("@/utils/db-helper")

Task.generateMaterialCategoryID = (connection) => new Promise((resolve, reject) => {
  let code = `MTC${formatDate(new Date(), 'yyyyMMdd')}-`
  let digit = 3

  let sql = `SELECT CONCAT(${connection.escape(code)}, LPAD(IFNULL(MAX(CAST(SUBSTRING(material_category_id,${(code.length + 1)},${digit}) AS SIGNED)),0) + 1,${digit},0)) AS id 
		FROM tb_material_category
		WHERE material_category_id LIKE (${connection.escape(`${code}%`)}) 
	`
  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res[0].id) })
})

Task.getMaterialCategoryBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let condition = mapToCondition(data)
  const { filter, pagination, sort, group } = generateQuery(data)

  const core_query = `SELECT *
    FROM tb_material_category AS tb
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

Task.getMaterialCategoryByID = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `SELECT * FROM tb_material_category
    WHERE material_category_id = ${connection.escape(data.material_category_id)}
    `
  connection.query(sql, function (err, res) {
    if (err) return reject(new Error(err.message))
    if (!res.length) return data.required === false ? resolve() : reject(new Error('Not Found'))

    resolve(res[0])
  })
})

Task.insertMaterialCategory = (connection, data = {}) => new Promise((resolve, reject) => {
  const sql = `
    INSERT INTO tb_material_category (
      material_category_id, 
      material_category_name, 
      addby, 
      adddate
    ) 
    VALUES (
      ${connection.escape(data.material_category_id)},
      ${connection.escape(data.material_category_name)}, 
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

Task.updateMaterialCategoryBy = (connection, data = {}) => new Promise((resolve, reject) => {
  const sql = `
    UPDATE tb_material_category SET    
      material_category_name = ${connection.escape(data.material_category_name)}, 
      updateby = 'admin',
      lastupdate = NOW()
    WHERE material_category_id = ${connection.escape(data.material_category_id)}
  `;

  connection.query(sql, (err, res) => {
    if (err) {
      reject(new Error(err.message));
    } else {
      resolve(res);
    }
  });
});

Task.deleteMaterialCategoryBy = (connection, data = {}) => new Promise((resolve, reject) => {
  let sql = `DELETE FROM tb_material_category WHERE material_category_id = ${connection.escape(data.material_category_id)} `

  connection.query(sql, function (err, res) { err ? reject(new Error(err.message)) : resolve(res) })
})

module.exports = Task