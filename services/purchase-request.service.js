const Task = function (task) { this.task = task.task }

const { PurchaseRequestModel } = require('@/models')

Task.generatePurchaseRequestID = (connection) => PurchaseRequestModel.generatePurchaseRequestID(connection)
Task.getPurchaseRequestBy = (connection, data) => PurchaseRequestModel.getPurchaseRequestBy(connection, data)
Task.getPurchaseRequestByID = (connection, data) => PurchaseRequestModel.getPurchaseRequestByID(connection, data)
Task.getPurchaseRequestPermissionBy = (connection, data) => PurchaseRequestModel.getPurchaseRequestPermissionBy(connection, data)

Task.insertPurchaseRequest = async (connection, data) => {
    data.pr_id = await PurchaseRequestModel.generatePurchaseRequestID(connection)
    await PurchaseRequestModel.insertPurchaseRequest(connection, data);
    return await PurchaseRequestModel.getPurchaseRequestByID(connection, { pr_id: data.pr_id });
};

Task.updatePurchaseRequestBy = async (connection, data) => {
    await PurchaseRequestModel.updatePurchaseRequestBy(connection, data);
    return await PurchaseRequestModel.getPurchaseRequestByID(connection, { pr_id: data.pr_id });
}

Task.deletePurchaseRequestBy = async (connection, data) => {
    await PurchaseRequestModel.deletePurchaseRequestBy(connection, data)
}

module.exports = Task