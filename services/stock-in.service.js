const Task = function (task) { this.task = task.task }

const { StockInModel } = require('@/models')
const ProductService = require('./product.service')
const MaterialService = require('./material.service')

Task.generateStockInID = (connection) => StockInModel.generateStockInID(connection)
Task.getStockInBy = (connection, data) => StockInModel.getStockInBy(connection, data)
Task.getStockInByID = (connection, data) => StockInModel.getStockInByID(connection, data)
Task.getStockInPermissionBy = (connection, data) => StockInModel.getStockInPermissionBy(connection, data)

Task.insertStockIn = async (connection, data) => {
    data.stock_in_id = await StockInModel.generateStockInID(connection);

    if (data.product) {
        const product = JSON.parse(data.product);
        const productArray = [];

        for (const item of product) {
            if (item.product_quantity === 0) {
                throw new Error("product_quantity cannot be zero.");
            }

            const product_data = {
                product_id: await ProductService.generateProductID(connection),
                product_name: item.product_name,
                product_quantity: item.product_quantity,
                product_price: item.product_price / item.product_quantity,
                unit_id: item.unit_id,
                stock_in_id: data.stock_in_id
            };

            productArray.push(product_data);
            await ProductService.insertProduct(connection, product_data);
        }
        data.product = JSON.stringify(productArray);
    }
    if (data.material) {
        const material = JSON.parse(data.material);
        const materialArray = [];

        for (const item of material) {
            if (item.material_quantity === 0) {
                throw new Error("material_quantity cannot be zero.");
            }

            const material_data = {
                material_id: await MaterialService.generateMaterialID(connection),
                material_name: item.material_name,
                material_quantity: item.material_quantity,
                material_price: item.material_price / item.material_quantity,
                unit_id: item.unit_id,
                stock_in_id: data.stock_in_id
            };

            materialArray.push(material_data);
            await MaterialService.insertMaterial(connection, material_data);
        }

        data.material = JSON.stringify(materialArray);
    }
    await StockInModel.insertStockIn(connection, data);
    const stockInData = await StockInModel.getStockInByID(connection, { stock_in_id: data.stock_in_id });

    return {
        message: "✅ Add stock done",
        stock_in: stockInData
    };
};

Task.updateStockInBy = async (connection, data) => {
    console.log(data);

    if (data.del_pd_arr) {
        for (const pd_id of data.del_pd_arr) {
            console.log(pd_id);

            await ProductService.deleteProductBy(connection, { product_id: pd_id })
        }
    }
    if (data.del_mt_arr) {
        for (const mt_id of data.del_mt_arr) {
            console.log(mt_id);
            await MaterialService.deleteMaterialBy(connection, { material_id: mt_id })

        }
    }
    if (data.product) {
        const products = JSON.parse(data.product);
        const productArray = [];

        for (const product of products) {
            if (product.product_id) {
                await ProductService.updateProductBy(connection, product);
            } else {
                product.product_id = await ProductService.generateProductID(connection);
                product.stock_in_id = data.stock_in_id
                product.product_price = product.product_price / product.product_quantity
                await ProductService.insertProduct(connection, product);
            }
            productArray.push(product);
        }

        data.product = JSON.stringify(productArray);
    }
    if (data.material) {
        const materials = JSON.parse(data.material);
        const materialArray = [];

        for (const material of materials) {
            if (material.material_id) {
                await MaterialService.updateMaterialBy(connection, material);
            } else {
                material.material_id = await MaterialService.generateMaterialID(connection);
                material.stock_in_id = data.stock_in_id
                material.material_price = material.material_price / material.material_quantity
                await MaterialService.insertMaterial(connection, material);
            }
            materialArray.push(material);
        }

        data.material = JSON.stringify(materialArray);
    }
    await StockInModel.updateStockInBy(connection, data);
    const stockInData = await StockInModel.getStockInByID(connection, { stock_in_id: data.stock_in_id });

    return {
        message: "Update stock done",
        stock_in: stockInData
    };
};

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