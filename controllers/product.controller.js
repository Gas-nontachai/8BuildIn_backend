const Task = function (task) { this.task = task.task }

const { ProductService, } = require('@/services')

Task.generateProductID = (req) => req.useConnection((connection) => ProductService.generateProductID(connection, req.body))
Task.getProductBy = (req) => req.useConnection((connection) => ProductService.getProductBy(connection, req.body))
Task.getProductByID = (req) => req.useConnection((connection) => ProductService.getProductByID(connection, req.body))
Task.insertProduct = (req) => req.useTransaction((connection) => ProductService.insertProduct(connection, req.body, req.files))
Task.updateProductBy = (req) => req.useTransaction((connection) => ProductService.updateProductBy(connection, req.body, req.files))
Task.deleteProductBy = (req) => req.useTransaction((connection) => ProductService.deleteProductBy(connection, req.body))

module.exports = Task