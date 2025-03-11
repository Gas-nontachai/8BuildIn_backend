const Task = function (task) { this.task = task.task }

const { StockInService, } = require('@/services')

Task.generateStockInID = (req) => req.useConnection((connection) => StockInService.generateStockInID(connection, req.body))
Task.getStockInBy = (req) => req.useConnection((connection) => StockInService.getStockInBy(connection, req.body))
Task.getStockInByID = (req) => req.useConnection((connection) => StockInService.getStockInByID(connection, req.body))
Task.insertStockIn = (req) => req.useTransaction((connection) => StockInService.insertStockIn(connection, req.body))
Task.updateStockInBy = (req) => req.useTransaction((connection) => StockInService.updateStockInBy(connection, req.body))
Task.deleteStockInBy = (req) => req.useTransaction((connection) => StockInService.deleteStockInBy(connection, req.body))

module.exports = Task