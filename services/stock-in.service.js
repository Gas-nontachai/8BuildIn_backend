const Task = function (task) { this.task = task.task }

const { StockInModel, ProductModel, MaterialModel, PurchaseOrderModel } = require('@/models')

Task.generateStockInID = (connection) => StockInModel.generateStockInID(connection)
Task.getStockInBy = (connection, data) => StockInModel.getStockInBy(connection, data)
Task.getStockInByID = (connection, data) => StockInModel.getStockInByID(connection, data)
Task.getStockInPermissionBy = (connection, data) => StockInModel.getStockInPermissionBy(connection, data)

Task.insertStockIn = async (connection, data) => {
    data.stock_in_id = await StockInModel.generateStockInID(connection);

    if (data.product) {
        const product = JSON.parse(data.product);
        if (product.some(item => item.product_quantity === 0)) return { message: "Product quantity cannot be zero." };

        const productPromises = product.map(async (item) => {
            const product_data = {
                product_id: await ProductModel.generateProductID(connection),
                product_name: item.product_name,
                product_quantity: item.product_quantity,
                product_price: item.product_price / item.product_quantity,
                unit_id: item.unit_id,
                stock_in_id: data.stock_in_id
            };

            await ProductModel.insertProduct(connection, product_data);
            return product_data;
        });
        data.product = JSON.stringify(await Promise.all(productPromises));
    }
    if (data.material) {
        const material = JSON.parse(data.material);
        if (material.some(item => item.material_quantity === 0)) return { message: "Material quantity cannot be zero." };
        const materialPromises = material.map(async (item) => {
            const material_data = {
                material_id: await MaterialModel.generateMaterialID(connection),
                material_name: item.material_name,
                material_quantity: item.material_quantity,
                material_price: item.material_price / item.material_quantity,
                unit_id: item.unit_id,
                stock_in_id: data.stock_in_id
            };
            await MaterialModel.insertMaterial(connection, material_data);
            return material_data;
        });
        data.material = JSON.stringify(await Promise.all(materialPromises));
    }
    let po_data = await PurchaseOrderModel.getPurchaseOrderByID(connection, { po_id: data.po_id });
    po_data = {
        ...po_data,
        po_status: 'success'
    }
    await PurchaseOrderModel.updatePurchaseOrderBy(connection, po_data);
    await StockInModel.insertStockIn(connection, data);
    const stockInData = await StockInModel.getStockInByID(connection, { stock_in_id: data.stock_in_id });
    return {
        message: "Add stock done",
        stock_in: stockInData
    };
};

Task.updateStockInBy = async (connection, data) => {
    if (data.del_pd_arr) {
        for (const pd_id of data.del_pd_arr) {
            await ProductModel.deleteProductBy(connection, { product_id: pd_id })
        }
    }
    if (data.del_mt_arr) {
        for (const mt_id of data.del_mt_arr) {
            await MaterialModel.deleteMaterialBy(connection, { material_id: mt_id })

        }
    }
    if (data.product) {
        const products = JSON.parse(data.product);
        const productArray = [];

        for (const product of products) {
            if (product.product_id) {
                const old_product = await ProductModel.getProductByID(connection, product);
                product.stock_in_id = data.stock_in_id
                product.product_price = product.product_price / product.product_quantity
                product.product_img = old_product.product_img
                product.product_category_id = old_product.product_category_id
                product.unit_id = old_product.unit_id
                await ProductModel.updateProductBy(connection, product);
            } else {
                product.product_id = await ProductModel.generateProductID(connection);
                product.stock_in_id = data.stock_in_id
                product.product_price = product.product_price / product.product_quantity
                await ProductModel.insertProduct(connection, product);
            }
            product.product_price = product.product_price * product.product_quantity
            productArray.push(product);
        }
        data.product = JSON.stringify(productArray);
    }
    if (data.material) {
        const materials = JSON.parse(data.material);
        const materialArray = [];

        for (const material of materials) {
            if (material.material_id) {
                const old_material = await MaterialModel.getMaterialByID(connection, material);
                material.stock_in_id = data.stock_in_id
                material.material_price = material.material_price / material.material_quantity
                material.material_img = old_material.material_img
                material.material_category_id = old_material.material_category_id
                material.unit_id = old_material.unit_id
                await MaterialModel.updateMaterialBy(connection, material);
            } else {
                material.material_id = await MaterialModel.generateMaterialID(connection);
                material.stock_in_id = data.stock_in_id
                material.material_price = material.material_price / material.material_quantity
                await MaterialModel.insertMaterial(connection, material);
            }
            material.material_price = material.material_price * material.material_quantity
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
    const { docs: old_product_data } = await ProductModel.getProductBy(connection, { match: { stock_in_id: data.stock_in_id } })
    const { docs: old_material_data } = await MaterialModel.getMaterialBy(connection, { match: { stock_in_id: data.stock_in_id } })
    const del_product = old_product_data.map(item => item.product_id)
    const del_material = old_material_data.map(item => item.material_id)
    for (const product_id of del_product) {
        await ProductModel.deleteProductBy(connection, { product_id })
    }
    for (const material_id of del_material) {
        await MaterialModel.deleteMaterialBy(connection, { material_id })
    }
    await StockInModel.deleteStockInBy(connection, data)
}

module.exports = Task