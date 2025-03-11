const Task = function (task) { this.task = task.task }

const { MaterialService, } = require('@/services')

Task.generateMaterialID = (req) => req.useConnection((connection) => MaterialService.generateMaterialID(connection, req.body))
Task.getMaterialBy = (req) => req.useConnection((connection) => MaterialService.getMaterialBy(connection, req.body))
Task.getMaterialByID = (req) => req.useConnection((connection) => MaterialService.getMaterialByID(connection, req.body))
Task.insertMaterial = (req) => req.useTransaction((connection) => MaterialService.insertMaterial(connection, req.body, req.files))
Task.updateMaterialBy = (req) => req.useTransaction((connection) => MaterialService.updateMaterialBy(connection, req.body, req.files))
Task.deleteMaterialBy = (req) => req.useTransaction((connection) => MaterialService.deleteMaterialBy(connection, req.body))

module.exports = Task