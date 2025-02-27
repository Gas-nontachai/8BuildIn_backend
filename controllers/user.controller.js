const Task = function (task) { this.task = task.task }

const { UserService, } = require('@/services')

Task.generateUserID = (req) => req.useConnection((connection) => UserService.generateUserID(connection, req.body))
Task.getUserBy = (req) => req.useConnection((connection) => UserService.getUserBy(connection, req.body))
Task.getUserNameBy = (req) => req.useConnection((connection) => UserService.getUserNameBy(connection, req.body))
Task.getUserByID = (req) => req.useConnection((connection) => UserService.getUserByID(connection, req.body))

Task.insertUser = (req) => req.useConnection((connection) => UserService.insertUser(connection, req.body, req.files));
Task.updateUserApprove = (req) => req.useConnection((connection) => UserService.updateUserApprove(connection, req.body))
Task.updateUserBy = (req) => req.useConnection((connection) => UserService.updateUserBy(connection, req.body, req.files));
Task.updatePasswordUserBy = (req) => req.useConnection((connection) => UserService.updatePasswordUserBy(connection, req.body))
Task.deleteUserBy = (req) => req.useConnection((connection) => UserService.deleteUserBy(connection, req.body))

module.exports = Task
