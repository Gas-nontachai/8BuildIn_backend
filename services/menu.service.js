const Task = function (task) { this.task = task.task }

const { MenuModel } = require('@/models')

Task.generateMenuID = (connection) => MenuModel.generateMenuID(connection)
Task.getMenuBy = (connection, data) => MenuModel.getMenuBy(connection, data)
Task.getMenuByID = (connection, data) => MenuModel.getMenuByID(connection, data)
Task.getMenuPermissionBy = (connection, data) => MenuModel.getMenuPermissionBy(connection, data)

Task.insertMenu = async (connection, data) => {
    data.menu_id = await MenuModel.generateMenuID(connection)
    await MenuModel.insertMenu(connection, data);
    return await MenuModel.getMenuByID(connection, { menu_id: data.menu_id });
};

Task.updateMenuBy = async (connection, data) => {
    await MenuModel.updateMenuBy(connection, data);
    return await MenuModel.getMenuByID(connection, { menu_id: data.menu_id });
}

Task.deleteMenuBy = async (connection, data) => {
    await MenuModel.deleteMenuBy(connection, data)
}

module.exports = Task