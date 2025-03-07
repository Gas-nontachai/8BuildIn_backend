const Task = function (task) { this.task = task.task }

const { CartService, } = require('@/services')

Task.generateCartID = (req) => req.useConnection((connection) => CartService.generateCartID(connection, req.body))
Task.getCartBy = (req) => req.useConnection((connection) => CartService.getCartBy(connection, req.body))
Task.getCartByID = (req) => req.useConnection((connection) => CartService.getCartByID(connection, req.body))
Task.insertCart = (req) => req.useConnection((connection) => CartService.insertCart(connection, req.body))
Task.updateCartBy = (req) => req.useConnection((connection) => CartService.updateCartBy(connection, req.body))
Task.deleteCartBy = (req) => req.useConnection((connection) => CartService.deleteCartBy(connection, req.body))

module.exports = Task