const Task = function (task) { this.task = task.task }

const { ProductModel } = require('@/models')
const { fileUpload, removeFile } = require("@/utils/file-helper");

const directory = 'product_imgs'

Task.generateProductID = (connection) => ProductModel.generateProductID(connection)
Task.getProductBy = (connection, data) => ProductModel.getProductBy(connection, data)
Task.getProductByID = (connection, data) => ProductModel.getProductByID(connection, data)

Task.insertProduct = async (connection, data, files) => {
    if (data.product) {
        const product = JSON.parse(data.product);

        product.material = JSON.stringify(product.material)
        product.product_id = await ProductModel.generateProductID(connection)

        if (files) {
            for (const key in files) {
                const product_img = await fileUpload(files[key], directory)
                product.product_img = product_img
                await ProductModel.insertProduct(connection, product);
                return await ProductModel.getProductByID(connection, { product_id: product.product_id });
            };
        } else {
            await ProductModel.insertProduct(connection, product);
            return await ProductModel.getProductByID(connection, { product_id: product.product_id });
        }
    } else {
        data.product_id = await ProductModel.generateProductID(connection)
        await ProductModel.insertProduct(connection, data);
    }
};

Task.updateProductBy = async (connection, data, files) => {
    const product = JSON.parse(data.product);
    const old_product = await ProductModel.getProductByID(connection, { product_id: product.product_id })
    await removeFile(old_product.product_img)

    if (files) {
        for (const key in files) {
            const product_img = await fileUpload(files[key], directory)
            product.product_img = product_img
            await ProductModel.updateProductBy(connection, product);
            return await ProductModel.getProductByID(connection, { product_id: product.product_id });
        };
    } else {
        await ProductModel.updateProductBy(connection, product);
        return await ProductModel.getProductByID(connection, { product_id: product.product_id });
    }
}

Task.deleteProductBy = async (connection, data) => {
    await ProductModel.deleteProductBy(connection, data)
}

module.exports = Task