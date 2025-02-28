const Task = function (task) { this.task = task.task }

const { MaterialCategoryModel } = require('@/models')

Task.generateMaterialCategoryID = (connection) => MaterialCategoryModel.generateMaterialCategoryID(connection)
Task.getMaterialCategoryBy = (connection, data) => MaterialCategoryModel.getMaterialCategoryBy(connection, data)
Task.getMaterialCategoryByID = (connection, data) => MaterialCategoryModel.getMaterialCategoryByID(connection, data)

Task.insertMaterialCategory = async (connection, data) => {
    data.material_category_id = await MaterialCategoryModel.generateMaterialCategoryID(connection)
    await MaterialCategoryModel.insertMaterialCategory(connection, data);
    return await MaterialCategoryModel.getMaterialCategoryByID(connection, { material_category_id: data.material_category_id });
};

Task.updateMaterialCategoryBy = async (connection, data) => {
    await MaterialCategoryModel.updateMaterialCategoryBy(connection, data);
    return await MaterialCategoryModel.getMaterialCategoryByID(connection, { material_category_id: data.material_category_id });
}

Task.deleteMaterialCategoryBy = async (connection, data) => {
    await MaterialCategoryModel.deleteMaterialCategoryBy(connection, data)
}

module.exports = Task