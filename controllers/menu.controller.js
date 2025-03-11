const Task = function (task) { this.task = task.task }

const { MenuService, } = require('@/services')

Task.generateMenuID = (req) => req.useConnection((connection) => MenuService.generateMenuID(connection, req.body))
Task.getMenuBy = (req) => req.useConnection((connection) => MenuService.getMenuBy(connection, req.body))
Task.getMenuByID = (req) => req.useConnection((connection) => MenuService.getMenuByID(connection, req.body))
Task.getMenuPermissionBy = (req) => req.useConnection((connection) => MenuService.getMenuPermissionBy(connection, req.body))
Task.insertMenu = (req) => req.useTransaction((connection) => MenuService.insertMenu(connection, req.body))
Task.updateMenuBy = (req) => req.useTransaction((connection) => MenuService.updateMenuBy(connection, req.body))
Task.deleteMenuBy = (req) => req.useTransaction((connection) => MenuService.deleteMenuBy(connection, req.body))

module.exports = Task