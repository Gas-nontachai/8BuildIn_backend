const Task = function (task) { this.task = task.task }

const { ProductCategoryService, } = require('@/services')

Task.generateProductCategoryID = (req) => req.useConnection((connection) => ProductCategoryService.generateProductCategoryID(connection, req.body))
Task.getProductCategoryBy = (req) => req.useConnection((connection) => ProductCategoryService.getProductCategoryBy(connection, req.body))
Task.getProductCategoryByID = (req) => req.useConnection((connection) => ProductCategoryService.getProductCategoryByID(connection, req.body))
Task.insertProductCategory = (req) => req.useTransaction((connection) => ProductCategoryService.insertProductCategory(connection, req.body))
Task.updateProductCategoryBy = (req) => req.useTransaction((connection) => ProductCategoryService.updateProductCategoryBy(connection, req.body))
Task.deleteProductCategoryBy = (req) => req.useTransaction((connection) => ProductCategoryService.deleteProductCategoryBy(connection, req.body))

module.exports = Task