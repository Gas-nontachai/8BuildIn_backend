const Task = function (task) { this.task = task.task }

const { CustomerService, } = require('@/services')

Task.generateCustomerID = (req) => req.useConnection((connection) => CustomerService.generateCustomerID(connection, req.body))
Task.getCustomerBy = (req) => req.useConnection((connection) => CustomerService.getCustomerBy(connection, req.body))
Task.getCustomerByID = (req) => req.useConnection((connection) => CustomerService.getCustomerByID(connection, req.body))
Task.insertCustomer = (req) => req.useTransaction((connection) => CustomerService.insertCustomer(connection, req.body))
Task.updateCustomerBy = (req) => req.useTransaction((connection) => CustomerService.updateCustomerBy(connection, req.body))
Task.deleteCustomerBy = (req) => req.useTransaction((connection) => CustomerService.deleteCustomerBy(connection, req.body))

module.exports = Task