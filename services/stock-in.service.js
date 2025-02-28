const Task = function (task) { this.task = task.task }

const { StockInModel } = require('@/models')

Task.generateStockInID = (connection) => StockInModel.generateStockInID(connection)
Task.getStockInBy = (connection, data) => StockInModel.getStockInBy(connection, data)
Task.getStockInByID = (connection, data) => StockInModel.getStockInByID(connection, data)
Task.getStockInPermissionBy = (connection, data) => StockInModel.getStockInPermissionBy(connection, data)

Task.insertStockIn = async (connection, data) => {
    data.stock_in_id = await StockInModel.generateStockInID(connection)
    await StockInModel.insertStockIn(connection, data);
    return await StockInModel.getStockInByID(connection, { stock_in_id: data.stock_in_id });
};

Task.updateStockInBy = async (connection, data) => {
    await StockInModel.updateStockInBy(connection, data);
    return await StockInModel.getStockInByID(connection, { stock_in_id: data.stock_in_id });
}

Task.deleteStockInBy = async (connection, data) => {
    await StockInModel.deleteStockInBy(connection, data)
}

module.exports = Task