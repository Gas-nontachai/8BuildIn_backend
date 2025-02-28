const Task = function (task) { this.task = task.task }

const { UnitModel } = require('@/models')

Task.generateUnitID = (connection) => UnitModel.generateUnitID(connection)
Task.getUnitBy = (connection, data) => UnitModel.getUnitBy(connection, data)
Task.getUnitByID = (connection, data) => UnitModel.getUnitByID(connection, data)
Task.getUnitPermissionBy = (connection, data) => UnitModel.getUnitPermissionBy(connection, data)

Task.insertUnit = async (connection, data) => {
    data.unit_id = await UnitModel.generateUnitID(connection)
    await UnitModel.insertUnit(connection, data);
    return await UnitModel.getUnitByID(connection, { unit_id: data.unit_id });
};

Task.updateUnitBy = async (connection, data) => {
    await UnitModel.updateUnitBy(connection, data);
    return await UnitModel.getUnitByID(connection, { unit_id: data.unit_id });
}

Task.deleteUnitBy = async (connection, data) => {
    await UnitModel.deleteUnitBy(connection, data)
}

module.exports = Task