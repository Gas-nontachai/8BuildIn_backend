const Task = function (task) { this.task = task.task }

const { PurchaseOrderModel } = require('@/models')

Task.generatePurchaseOrderID = (connection) => PurchaseOrderModel.generatePurchaseOrderID(connection)
Task.getPurchaseOrderBy = (connection, data) => PurchaseOrderModel.getPurchaseOrderBy(connection, data)
Task.getPurchaseOrderByID = (connection, data) => PurchaseOrderModel.getPurchaseOrderByID(connection, data)
Task.getPurchaseOrderPermissionBy = (connection, data) => PurchaseOrderModel.getPurchaseOrderPermissionBy(connection, data)

Task.insertPurchaseOrder = async (connection, data) => {
    data.pr_id = await PurchaseOrderModel.generatePurchaseOrderID(connection)
    await PurchaseOrderModel.insertPurchaseOrder(connection, data);
    return await PurchaseOrderModel.getPurchaseOrderByID(connection, { pr_id: data.pr_id });
};

Task.updatePurchaseOrderBy = async (connection, data) => {
    await PurchaseOrderModel.updatePurchaseOrderBy(connection, data);
    return await PurchaseOrderModel.getPurchaseOrderByID(connection, { pr_id: data.pr_id });
}

Task.deletePurchaseOrderBy = async (connection, data) => {
    await PurchaseOrderModel.deletePurchaseOrderBy(connection, data)
}

module.exports = Task