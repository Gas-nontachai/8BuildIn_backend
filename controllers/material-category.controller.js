const Task = function (task) { this.task = task.task }

const { MaterialCategoryService, } = require('@/services')

Task.generateMaterialCategoryID = (req) => req.useConnection((connection) => MaterialCategoryService.generateMaterialCategoryID(connection, req.body))
Task.getMaterialCategoryBy = (req) => req.useConnection((connection) => MaterialCategoryService.getMaterialCategoryBy(connection, req.body))
Task.getMaterialCategoryByID = (req) => req.useConnection((connection) => MaterialCategoryService.getMaterialCategoryByID(connection, req.body))
Task.insertMaterialCategory = (req) => req.useTransaction((connection) => MaterialCategoryService.insertMaterialCategory(connection, req.body))
Task.updateMaterialCategoryBy = (req) => req.useTransaction((connection) => MaterialCategoryService.updateMaterialCategoryBy(connection, req.body))
Task.deleteMaterialCategoryBy = (req) => req.useTransaction((connection) => MaterialCategoryService.deleteMaterialCategoryBy(connection, req.body))

module.exports = Task