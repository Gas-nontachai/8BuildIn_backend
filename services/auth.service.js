const Task = function (task) { this.task = task.task }

const { fileUpload } = require("@/utils/file-helper");

const directory = 'employee_imgs'

const jwt = require("jsonwebtoken")

const config = require("@/configs/auth.config")

const { PermissionModel, EmployeeModel } = require("@/models")

const { generateAuthJWT } = require("@/utils/auth-helper")

Task.getMyCredential = async (connection) => {
  if (!connection.session._employee) return { error: { message: 'Invalid Token' } }

  const employee = await EmployeeModel.getEmployeeByID(connection, { employee_id: connection.session._employee.employee_id, })
  const { docs: permissions } = await PermissionModel.getPermissionBy(connection, { license_id: employee.license_id, })

  return {
    employee,
    permissions,
  }
}

Task.login = async (connection, data) => {
  const { employee_username, employee_password, } = data
  const employee = await EmployeeModel.checkLogin(connection, { employee_username, employee_password, })

  return generateAuthJWT(employee)
}

Task.register = async (connection, data, files) => {
  const employee = JSON.parse(data.employee);
  employee.employee_id = await EmployeeModel.generateEmployeeID(connection)

  if (files) {
    for (const key in files) {
      const employee_img = await fileUpload(files[key], directory)
      employee.employee_img = employee_img
      await EmployeeModel.register(connection, employee);
    };
  } else {
    await EmployeeModel.register(connection, employee);
  }
};

Task.refresh = async (connection, data) => {
  const { refresh_token, } = data

  const decoded = jwt.verify(refresh_token, config.secret);

  const employee = await EmployeeModel.checkLogin(connection, { employee_id: decoded.employee_id, })

  return generateAuthJWT(employee)
}

Task.changePassword = async (connection, data) => {
  const { new_password, current_password } = data
  const employee = await EmployeeModel.getEmployeeCredentialByID(connection, { employee_id: connection.session._employee?.employee_id, }) 
  if (employee.employee_password !== current_password) return { error: { message: 'Invalid password' } } 
  await EmployeeModel.updatePasswordEmployeeBy(connection, {
    employee_id: connection.session._employee?.employee_id,
    employee_password: new_password,
  })
}

module.exports = Task