const Task = function (task) { this.task = task.task }

const { StockInModel } = require('@/models')
const ProductService = require('./product.service')
const MaterialService = require('./material.service')

Task.generateStockInID = (connection) => StockInModel.generateStockInID(connection)
Task.getStockInBy = (connection, data) => StockInModel.getStockInBy(connection, data)
Task.getStockInByID = (connection, data) => StockInModel.getStockInByID(connection, data)
Task.getStockInPermissionBy = (connection, data) => StockInModel.getStockInPermissionBy(connection, data)

Task.insertStockIn = async (connection, data) => {
    data.stock_in_id = await StockInModel.generateStockInID(connection)
    await StockInModel.insertStockIn(connection, data);
    const res = await StockInModel.getStockInByID(connection, { stock_in_id: data.stock_in_id })
    if (data.product) {
        const product = JSON.parse(data.product)

        for (const item of product) {
            const product_data = {
                product_name: item.product_name,
                product_quantity: item.product_quantity,
                product_price: item.product_price / item.product_quantity,
                stock_in_id: res.stock_in_id
            }
            await ProductService.insertProduct(connection, product_data)
        }
    }
    if (data.material) {
        const material = JSON.parse(data.material)
        for (const item of material) {
            const material_data = {
                material_name: item.material_name,
                material_quantity: item.material_quantity,
                material_price: item.material_price / item.material_quantity,
                stock_in_id: res.stock_in_id
            }
            await MaterialService.insertMaterial(connection, material_data)
        }
    }
    return {
        message: "add stock done"
    }
};

Task.updateStockInBy = async (connection, data) => {
    const { docs: old_product_data } = await ProductService.getProductBy(connection, { match: { stock_in_id: data.stock_in_id } })
    const { docs: old_material_data } = await MaterialService.getMaterialBy(connection, { match: { stock_in_id: data.stock_in_id } })
    const del_product = old_product_data.map(item => item.product_id)
    const del_material = old_material_data.map(item => item.material_id)
    for (const product_id of del_product) {
        await ProductService.deleteProductBy(connection, { product_id })
    }
    for (const material_id of del_material) {
        await MaterialService.deleteMaterialBy(connection, { material_id })
    }
    await StockInModel.updateStockInBy(connection, data);
    if (data.product) {
        const product = JSON.parse(data.product)

        for (const item of product) {
            const product_data = {
                product_name: item.product_name,
                product_quantity: item.product_quantity,
                product_price: item.product_price / item.product_quantity,
                stock_in_id: data.stock_in_id
            }
            await ProductService.insertProduct(connection, product_data)
        }
    }
    if (data.material) {
        const material = JSON.parse(data.material)
        for (const item of material) {
            const material_data = {
                material_name: item.material_name,
                material_quantity: item.material_quantity,
                material_price: item.material_price / item.material_quantity,
                stock_in_id: data.stock_in_id
            }
            await MaterialService.insertMaterial(connection, material_data)
        }
    }
    return {
        message: "update stock done"
    }
}

Task.deleteStockInBy = async (connection, data) => {
    const { docs: old_product_data } = await ProductService.getProductBy(connection, { match: { stock_in_id: data.stock_in_id } })
    const { docs: old_material_data } = await MaterialService.getMaterialBy(connection, { match: { stock_in_id: data.stock_in_id } })
    const del_product = old_product_data.map(item => item.product_id)
    const del_material = old_material_data.map(item => item.material_id)
    for (const product_id of del_product) {
        await ProductService.deleteProductBy(connection, { product_id })
    }
    for (const material_id of del_material) {
        await MaterialService.deleteMaterialBy(connection, { material_id })
    }
    await StockInModel.deleteStockInBy(connection, data)
}

module.exports = Task