const Task = function (task) { this.task = task.task }

const { CartModel } = require('@/models')

Task.generateCartID = (connection) => CartModel.generateCartID(connection)
Task.getCartBy = (connection, data) => CartModel.getCartBy(connection, data)
Task.getCartByID = (connection, data) => CartModel.getCartByID(connection, data)
Task.getCartPermissionBy = (connection, data) => CartModel.getCartPermissionBy(connection, data)

Task.insertCart = async (connection, data) => {
    const res = await CartModel.insertCart(connection, {
        match: {
            $and: [
                { product_id: data.product_id },
                { addby: connection.session._id }
            ]
        }
    });
    if (res.totalDocs) {
        return await CartModel.getCartByID(connection, { cart_id: data.cart_id });

    } else {
        data.cart_id = await CartModel.generateCartID(connection)
        await CartModel.insertCart(connection, data);
        return await CartModel.getCartByID(connection, { cart_id: data.cart_id });
    }
};

Task.updateCartBy = async (connection, data) => {
    await CartModel.updateCartBy(connection, data);
    return await CartModel.getCartByID(connection, { cart_id: data.cart_id });
}

Task.deleteCartBy = async (connection, data) => {
    await CartModel.deleteCartBy(connection, data)
}

module.exports = Task