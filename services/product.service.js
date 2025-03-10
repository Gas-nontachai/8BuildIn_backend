const Task = function (task) { this.task = task.task }

const { ProductModel } = require('@/models')
const { fileUpload, removeFile } = require("@/utils/file-helper");
const MaterialService = require('./material.service')

const directory = 'product_imgs'

Task.generateProductID = (connection) => ProductModel.generateProductID(connection)
Task.getProductBy = (connection, data) => ProductModel.getProductBy(connection, data)
Task.getProductByID = (connection, data) => ProductModel.getProductByID(connection, data)

Task.insertProduct = async (connection, data, files) => {
    if (data.product) {
        const product = JSON.parse(data.product);
        const img_arr = []

        if (!product.product_id) {
            product.product_id = await ProductModel.generateProductID(connection)
        }

        if (files) {
            for (const key in files) {
                const product_img = await fileUpload(files[key], directory)
                img_arr.push(product_img)
            };
            product.product_img = img_arr.join(',')
        }
        if (product.material) {
            const material = JSON.parse(product.material)
            for (const mt of material) {

                const res = await MaterialService.getMaterialByID(connection, { material_id: mt.material_id })
                const update_data = {
                    ...res,
                    material_id: mt.material_id,
                    material_quantity: res.material_quantity - mt.material_quantity
                }
                await MaterialService.updateMaterialBy(connection, update_data);
            }
        }
        await ProductModel.insertProduct(connection, product);
        return await ProductModel.getProductByID(connection, { product_id: product.product_id });
    } else {
        if (!data.product_id) {
            data.product_id = await ProductModel.generateProductID(connection)
        }
        await ProductModel.insertProduct(connection, data);
    }
};

Task.updateProductBy = async (connection, data, files) => {
    if (data.product) {
        const product = JSON.parse(data.product);
        const old_product = await ProductModel.getProductByID(connection, { product_id: product.product_id });

        let img_arr = old_product.product_img ? old_product.product_img.split(',') : [];
        if (data.del_img_arr) {
            const del_arr = JSON.parse(data.del_img_arr);
            img_arr = img_arr.filter(img => {
                if (del_arr.includes(img)) {
                    removeFile(img);
                    return false;
                }
                return true;
            });
        }
        if (files) {
            for (const key in files) {
                const product_img = await fileUpload(files[key], directory);
                img_arr.push(product_img);
            }
        }
        product.product_img = img_arr.join(',');
        await ProductModel.updateProductBy(connection, product);
        return await ProductModel.getProductByID(connection, { product_id: product.product_id });
    } else {
        await ProductModel.updateProductBy(connection, data);
    }
};

Task.deleteProductBy = async (connection, data) => {
    const res = await ProductModel.getProductByID(connection, { product_id: data.product_id })
    if (res.product_img) {
        for (const img of res.product_img.split(',')) {
            await removeFile(img)
        }
    }
    await ProductModel.deleteProductBy(connection, data)
}

module.exports = Task