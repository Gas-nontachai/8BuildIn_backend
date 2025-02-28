const Task = function (task) { this.task = task.task }

const { ProductCategoryModel } = require('@/models')

Task.generateProductCategoryID = (connection) => ProductCategoryModel.generateProductCategoryID(connection)
Task.getProductCategoryBy = (connection, data) => ProductCategoryModel.getProductCategoryBy(connection, data)
Task.getProductCategoryByID = (connection, data) => ProductCategoryModel.getProductCategoryByID(connection, data)

Task.insertProductCategory = async (connection, data) => {
    data.product_category_id = await ProductCategoryModel.generateProductCategoryID(connection)
    await ProductCategoryModel.insertProductCategory(connection, data);
    return await ProductCategoryModel.getProductCategoryByID(connection, { product_category_id: data.product_category_id });
};

Task.updateProductCategoryBy = async (connection, data) => {
    await ProductCategoryModel.updateProductCategoryBy(connection, data);
    return await ProductCategoryModel.getProductCategoryByID(connection, { product_category_id: data.product_category_id });
}

Task.deleteProductCategoryBy = async (connection, data) => {
    await ProductCategoryModel.deleteProductCategoryBy(connection, data)
}

module.exports = Task