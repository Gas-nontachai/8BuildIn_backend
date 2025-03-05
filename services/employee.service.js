const Task = function (task) { this.task = task.task }

const { fileUpload, removeFile } = require("@/utils/file-helper");

const directory = 'employee_imgs'

const { EmployeeModel, } = require("@/models")

Task.generateEmployeeID = (connection) => EmployeeModel.generateEmployeeID(connection)
Task.getEmployeeBy = (connection, data) => EmployeeModel.getEmployeeBy(connection, data)
Task.getEmployeeByID = (connection, data) => EmployeeModel.getEmployeeByID(connection, data)

Task.insertEmployee = async (connection, data, files) => {
  const employee = JSON.parse(data.employee);

  employee.employee_id = await EmployeeModel.generateEmployeeID(connection)

  if (files) {
    for (const key in files) {
      const employee_img = await fileUpload(files[key], directory)
      employee.employee_img = employee_img
      await EmployeeModel.insertEmployee(connection, employee);
      return await EmployeeModel.getEmployeeByID(connection, { employee_id: employee.employee_id });
    };
  } else {
    await EmployeeModel.insertEmployee(connection, employee);
    return await EmployeeModel.getEmployeeByID(connection, { employee_id: employee.employee_id });
  }
};

Task.updateEmployeeBy = async (connection, data, files) => {
  const employee = JSON.parse(data.employee);
  const old_employee = await EmployeeModel.getEmployeeByID(connection, { employee_id: employee.employee_id })
  await removeFile(old_employee.employee_img)

  if (files) {
    for (const key in files) {
      const employee_img = await fileUpload(files[key], directory)
      employee.employee_img = employee_img
      await EmployeeModel.updateEmployeeBy(connection, employee);
      return await EmployeeModel.getEmployeeByID(connection, { employee_id: employee.employee_id });
    };
  } else {
    await EmployeeModel.updateEmployeeBy(connection, employee);
    return await EmployeeModel.getEmployeeByID(connection, { employee_id: employee.employee_id });
  }
}

Task.deleteEmployeeBy = async (connection, data) => {
  const old_employee = await EmployeeModel.getEmployeeByID(connection, data)
  await removeFile(old_employee.employee_img)
  EmployeeModel.deleteEmployeeBy(connection, data)
}

module.exports = Task