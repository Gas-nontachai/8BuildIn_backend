const Task = function (task) { this.task = task.task }

const { StockOutModel } = require('@/models')

Task.generateStockOutID = (connection) => StockOutModel.generateStockOutID(connection)
Task.getStockOutBy = (connection, data) => StockOutModel.getStockOutBy(connection, data)
Task.getStockOutByID = (connection, data) => StockOutModel.getStockOutByID(connection, data)
Task.getStockOutPermissionBy = (connection, data) => StockOutModel.getStockOutPermissionBy(connection, data)

Task.insertStockOut = async (connection, data) => {
    data.stock_out_id = await StockOutModel.generateStockOutID(connection)
    await StockOutModel.insertStockOut(connection, data);
    return await StockOutModel.getStockOutByID(connection, { stock_out_id: data.stock_out_id });
};

Task.updateStockOutBy = async (connection, data) => {
    await StockOutModel.updateStockOutBy(connection, data);
    return await StockOutModel.getStockOutByID(connection, { stock_out_id: data.stock_out_id });
}

Task.deleteStockOutBy = async (connection, data) => {
    await StockOutModel.deleteStockOutBy(connection, data)
}

module.exports = Task