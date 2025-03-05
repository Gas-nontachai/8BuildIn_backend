const Task = function (task) { this.task = task.task }

const { fileUpload, removeFile } = require("@/utils/file-helper");

const directory = 'supplier_imgs'

const { SupplierModel } = require('@/models')

Task.generateSupplierID = (connection) => SupplierModel.generateSupplierID(connection)
Task.getSupplierBy = (connection, data) => SupplierModel.getSupplierBy(connection, data)
Task.getSupplierByID = (connection, data) => SupplierModel.getSupplierByID(connection, data)
Task.getSupplierPermissionBy = (connection, data) => SupplierModel.getSupplierPermissionBy(connection, data)

Task.insertSupplier = async (connection, data, files) => {
    const supplier = JSON.parse(data.supplier);
    supplier.supplier_id = await SupplierModel.generateSupplierID(connection)
    if (files) {
        for (const key in files) {
            const supplier_img = await fileUpload(files[key], directory)
            supplier.supplier_img = supplier_img
            await SupplierModel.insertSupplier(connection, supplier);
            return await SupplierModel.getSupplierByID(connection, { supplier_id: supplier.supplier_id });
        };
    } else {
        await SupplierModel.insertSupplier(connection, supplier);
        return await SupplierModel.getSupplierByID(connection, { supplier_id: supplier.supplier_id });
    }
};

Task.updateSupplierBy = async (connection, data, files) => {
    const supplier = JSON.parse(data.supplier);
    const old_supplier = await SupplierModel.getSupplierByID(connection, { supplier_id: supplier.supplier_id })
    await removeFile(old_supplier.supplier_img)

    if (files) {
        for (const key in files) {
            const supplier_img = await fileUpload(files[key], directory)
            supplier.supplier_img = supplier_img
            await SupplierModel.updateSupplierBy(connection, supplier);
            return await SupplierModel.getSupplierByID(connection, { supplier_id: supplier.supplier_id });
        };
    } else {
        await SupplierModel.updateSupplierBy(connection, supplier);
        return await SupplierModel.getSupplierByID(connection, { supplier_id: supplier.supplier_id });
    }
}

Task.deleteSupplierBy = async (connection, data) => {
    await SupplierModel.deleteSupplierBy(connection, data)
}

module.exports = Task