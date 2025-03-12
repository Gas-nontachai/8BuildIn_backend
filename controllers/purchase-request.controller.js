const Task = function (task) { this.task = task.task }

const { PurchaseRequestService, } = require('@/services')

Task.generatePurchaseRequestID = (req) => req.useConnection((connection) => PurchaseRequestService.generatePurchaseRequestID(connection, req.body))
Task.getPurchaseRequestBy = (req) => req.useConnection((connection) => PurchaseRequestService.getPurchaseRequestBy(connection, req.body))
Task.getPurchaseRequestByID = (req) => req.useConnection((connection) => PurchaseRequestService.getPurchaseRequestByID(connection, req.body))

Task.insertPurchaseRequest = (req) => req.useTransaction((connection) => PurchaseRequestService.insertPurchaseRequest(connection, req.body))
Task.updatePurchaseRequestBy = (req) => req.useTransaction((connection) => PurchaseRequestService.updatePurchaseRequestBy(connection, req.body))
Task.deletePurchaseRequestBy = (req) => req.useTransaction((connection) => PurchaseRequestService.deletePurchaseRequestBy(connection, req.body))

module.exports = Task