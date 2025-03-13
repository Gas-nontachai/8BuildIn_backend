const Task = function (task) { this.task = task.task }

const { PurchaseRequestModel, PurchaseOrderModel } = require('@/models')

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
    if (data.pr_id) {
        const res = await PurchaseRequestModel.getPurchaseRequestByID(connection, { pr_id: data.pr_id });
        const updatedData = {
            ...res,
            pr_status: data.pr_status,
        };
        const po_id = await PurchaseOrderModel.generatePurchaseOrderID(connection);
        const insert_po_data = {
            po_id,
            pr_id: data.pr_id,
            supplier_id: "",
            product: res.product,
            material: res.material,
            po_status: "pending",
            po_note: res.pr_note,
        }
        await PurchaseOrderModel.insertPurchaseOrder(connection, insert_po_data);
        await PurchaseRequestModel.updatePurchaseRequestBy(connection, updatedData);
        return await PurchaseRequestModel.getPurchaseRequestByID(connection, { pr_id: data.pr_id });
    } else {
        throw new Error("Invalid data provided.");
    }
};

Task.deletePurchaseRequestBy = async (connection, data) => {
    await PurchaseRequestModel.deletePurchaseRequestBy(connection, data)
}

module.exports = Task