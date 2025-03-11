const Task = function (task) { this.task = task.task }

const { StockOutService, } = require('@/services')

Task.generateStockOutID = (req) => req.useConnection((connection) => StockOutService.generateStockOutID(connection, req.body))
Task.getStockOutBy = (req) => req.useConnection((connection) => StockOutService.getStockOutBy(connection, req.body))
Task.getStockOutByID = (req) => req.useConnection((connection) => StockOutService.getStockOutByID(connection, req.body))
Task.insertStockOut = (req) => req.useTransaction((connection) => StockOutService.insertStockOut(connection, req.body))
Task.updateStockOutBy = (req) => req.useTransaction((connection) => StockOutService.updateStockOutBy(connection, req.body))
Task.deleteStockOutBy = (req) => req.useTransaction((connection) => StockOutService.deleteStockOutBy(connection, req.body))

module.exports = Task