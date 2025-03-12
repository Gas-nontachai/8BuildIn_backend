const Task = function (task) { this.task = task.task }

const { PurchaseRequestModel } = require('@/models')

Task.generatePurchaseRequestID = (connection) => PurchaseRequestModel.generatePurchaseRequestID(connection)
Task.getPurchaseRequestBy = (connection, data) => PurchaseRequestModel.getPurchaseRequestBy(connection, data)
Task.getPurchaseRequestByID = (connection, data) => PurchaseRequestModel.getPurchaseRequestByID(connection, data)
Task.getPurchaseRequestPermissionBy = (connection, data) => PurchaseRequestModel.getPurchaseRequestPermissionBy(connection, data)

Task.insertPurchaseRequest = async (connection, data) => {
    data.purchaserequest_id = await PurchaseRequestModel.generatePurchaseRequestID(connection)
    await PurchaseRequestModel.insertPurchaseRequest(connection, data);
    return await PurchaseRequestModel.getPurchaseRequestByID(connection, { purchaserequest_id: data.purchaserequest_id });
};

Task.updatePurchaseRequestBy = async (connection, data) => {
    await PurchaseRequestModel.updatePurchaseRequestBy(connection, data);
    return await PurchaseRequestModel.getPurchaseRequestByID(connection, { purchaserequest_id: data.purchaserequest_id });
}

Task.deletePurchaseRequestBy = async (connection, data) => {
    await PurchaseRequestModel.deletePurchaseRequestBy(connection, data)
}

module.exports = Task