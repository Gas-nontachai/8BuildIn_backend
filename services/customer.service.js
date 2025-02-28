const Task = function (task) { this.task = task.task }

const { CustomerModel } = require('@/models')

Task.generateCustomerID = (connection) => CustomerModel.generateCustomerID(connection)
Task.getCustomerBy = (connection, data) => CustomerModel.getCustomerBy(connection, data)
Task.getCustomerByID = (connection, data) => CustomerModel.getCustomerByID(connection, data)

Task.insertCustomer = async (connection, data) => {
    data.customer_id = await CustomerModel.generateCustomerID(connection)
    await CustomerModel.insertCustomer(connection, data);
    return await CustomerModel.getCustomerByID(connection, { customer_id: data.customer_id });
};

Task.updateCustomerBy = async (connection, data) => {
    await CustomerModel.updateCustomerBy(connection, data);
    return await CustomerModel.getCustomerByID(connection, { customer_id: data.customer_id });
}

Task.deleteCustomerBy = async (connection, data) => {
    await CustomerModel.deleteCustomerBy(connection, data)
}

module.exports = Task