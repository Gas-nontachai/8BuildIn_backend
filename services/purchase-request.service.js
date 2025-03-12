const Task = function (task) { this.task = task.task }

const { PurchaseRequestModel } = require('@/models')

Task.generatePurchaseRequestID = (connection) => PurchaseRequestModel.generateStockInID(connection)
Task.getPurchaseRequestBy = (connection, data) => UnitModel.getUnitBy(connection, data)
Task.getPurchaseRequestByID = (connection, data) => UnitModel.getUnitByID(connection, data)

Task.insertPurchaseRequest = async (connection, data) => {
    data.pr_id = await PurchaseRequestModel.generatePurchaseRequestID(connection)
    await PurchaseRequestModel.insertPurchaseRequest(connection, data);
    return await PurchaseRequestModel.getPurchaseRequestByID(connection, { pr_id: data.pr_id });
};

module.exports = Task