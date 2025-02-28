const Task = function (task) { this.task = task.task }

const { EmployeeService, } = require('@/services')

Task.generateEmployeeID = (req) => req.useConnection((connection) => EmployeeService.generateEmployeeID(connection, req.body))
Task.getEmployeeBy = (req) => req.useConnection((connection) => EmployeeService.getEmployeeBy(connection, req.body))
Task.getEmployeeNameBy = (req) => req.useConnection((connection) => EmployeeService.getEmployeeNameBy(connection, req.body))
Task.getEmployeeByID = (req) => req.useConnection((connection) => EmployeeService.getEmployeeByID(connection, req.body))

Task.insertEmployee = (req) => req.useConnection((connection) => EmployeeService.insertEmployee(connection, req.body, req.files));
Task.updateEmployeeBy = (req) => req.useConnection((connection) => EmployeeService.updateEmployeeBy(connection, req.body, req.files));
Task.updatePasswordEmployeeBy = (req) => req.useConnection((connection) => EmployeeService.updatePasswordEmployeeBy(connection, req.body))
Task.deleteEmployeeBy = (req) => req.useConnection((connection) => EmployeeService.deleteEmployeeBy(connection, req.body))

module.exports = Task
