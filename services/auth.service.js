const Task = function (task) { this.task = task.task }

const { fileUpload } = require("@/utils/file-helper");

const directory = 'user_imgs'

const jwt = require("jsonwebtoken")

const config = require("@/configs/auth.config")

const { PermissionModel, UserModel } = require("@/models")

const { generateAuthJWT } = require("@/utils/auth-helper")

Task.getMyCredential = async (connection) => {
  if (!connection.session._user) return { error: { message: 'Invalid Token' } }

  const user = await UserModel.getUserByID(connection, { user_id: connection.session._user.user_id, })
  const { docs: permissions } = await PermissionModel.getPermissionBy(connection, { license_id: user.license_id, })

  return {
    user,
    permissions,
  }
}

Task.login = async (connection, data) => {
  const { user_username, user_password, } = data

  const user = await UserModel.checkLogin(connection, { user_username, user_password, })

  return generateAuthJWT(user)
}

Task.register = async (connection, data, files) => {
  const user = JSON.parse(data.user);
  user.user_id = await UserModel.generateUserID(connection)

  if (files) {
    for (const key in files) {
      const user_img = await fileUpload(files[key], directory)
      user.user_img = user_img
      await UserModel.register(connection, user);
    };
  } else {
    await UserModel.register(connection, user);
  }
};

Task.refresh = async (connection, data) => {
  const { refresh_token, } = data

  const decoded = jwt.verify(refresh_token, config.secret);

  const user = await UserModel.checkLogin(connection, { user_id: decoded.user_id, })

  return generateAuthJWT(user)
}

Task.changePassword = async (connection, data) => {
  const { new_password, current_password } = data

  const user = await UserModel.getUserCredentialByID(connection, { user_id: connection.session._user?.user_id, })

  if (user.user_password !== current_password) return { error: { message: 'Invalid password' } }

  await UserModel.updatePasswordUserBy(connection, {
    user_id: connection.session._user?.user_id,
    user_password: new_password,
  })
}

module.exports = Task