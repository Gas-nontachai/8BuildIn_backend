const Task = function (task) { this.task = task.task }

const { PurchaseOrderService, } = require('@/services')

Task.generatePurchaseOrderID = (req) => req.useConnection((connection) => PurchaseOrderService.generatePurchaseOrderID(connection, req.body))
Task.getPurchaseOrderBy = (req) => req.useConnection((connection) => PurchaseOrderService.getPurchaseOrderBy(connection, req.body))
Task.getPurchaseOrderByID = (req) => req.useConnection((connection) => PurchaseOrderService.getPurchaseOrderByID(connection, req.body))

Task.insertPurchaseOrder = (req) => req.useTransaction((connection) => PurchaseOrderService.insertPurchaseOrder(connection, req.body))
Task.updatePurchaseOrderBy = (req) => req.useTransaction((connection) => PurchaseOrderService.updatePurchaseOrderBy(connection, req.body))
Task.deletePurchaseOrderBy = (req) => req.useTransaction((connection) => PurchaseOrderService.deletePurchaseOrderBy(connection, req.body))

module.exports = Task