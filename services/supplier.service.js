const Task = function (task) { this.task = task.task }

const { SupplierModel } = require('@/models')

Task.generateSupplierID = (connection) => SupplierModel.generateSupplierID(connection)
Task.getSupplierBy = (connection, data) => SupplierModel.getSupplierBy(connection, data)
Task.getSupplierByID = (connection, data) => SupplierModel.getSupplierByID(connection, data)
Task.getSupplierPermissionBy = (connection, data) => SupplierModel.getSupplierPermissionBy(connection, data)

Task.insertSupplier = async (connection, data) => {
    data.supplier_id = await SupplierModel.generateSupplierID(connection)
    await SupplierModel.insertSupplier(connection, data);
    return await SupplierModel.getSupplierByID(connection, { supplier_id: data.supplier_id });
};

Task.updateSupplierBy = async (connection, data) => {
    await SupplierModel.updateSupplierBy(connection, data);
    return await SupplierModel.getSupplierByID(connection, { supplier_id: data.supplier_id });
}

Task.deleteSupplierBy = async (connection, data) => {
    await SupplierModel.deleteSupplierBy(connection, data)
}

module.exports = Task