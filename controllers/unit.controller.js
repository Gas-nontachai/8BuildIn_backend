const Task = function (task) { this.task = task.task }

const { UnitService, } = require('@/services')

Task.generateUnitID = (req) => req.useConnection((connection) => UnitService.generateUnitID(connection, req.body))
Task.getUnitBy = (req) => req.useConnection((connection) => UnitService.getUnitBy(connection, req.body))
Task.getUnitByID = (req) => req.useConnection((connection) => UnitService.getUnitByID(connection, req.body))
Task.insertUnit = (req) => req.useTransaction((connection) => UnitService.insertUnit(connection, req.body))
Task.updateUnitBy = (req) => req.useTransaction((connection) => UnitService.updateUnitBy(connection, req.body))
Task.deleteUnitBy = (req) => req.useTransaction((connection) => UnitService.deleteUnitBy(connection, req.body))

module.exports = Task