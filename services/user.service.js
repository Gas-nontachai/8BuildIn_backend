const Task = function (task) { this.task = task.task }

const { fileUpload, removeFile } = require("@/utils/file-helper");

const directory = 'user_imgs'
const imgs = ['user_img']

const { UserModel, } = require("@/models")

Task.generateUserID = (connection) => UserModel.generateUserID(connection)
Task.getUserBy = (connection, data) => UserModel.getUserBy(connection, data)
Task.getUserNameBy = (connection, data) => UserModel.getUserNameBy(connection, data)
Task.getUserByID = (connection, data) => UserModel.getUserByID(connection, data)

Task.insertUser = async (connection, data, files) => {
  const user = JSON.parse(data.user);

  user.user_id = await UserModel.generateUserID(connection)

  if (files) {
    for (const key in files) {
      const user_img = await fileUpload(files[key], directory)
      user.user_img = user_img
      await UserModel.insertUser(connection, user);
      return await UserModel.getUserByID(connection, { user_id: user.user_id });
    };
  } else {
    await UserModel.insertUser(connection, user);
    return await UserModel.getUserByID(connection, { user_id: user.user_id });
  }
};

Task.updateUserApprove = async (connection, data) => {
  await UserModel.updateUserApprove(connection, data)
  return await UserModel.getUserByID(connection, { user_id: data.user_id })
}

Task.updateUserBy = async (connection, data, files) => {
  const user = JSON.parse(data.user);
  const old_user = await UserModel.getUserByID(connection, { user_id: user.user_id })
  await removeFile(old_user.user_img)

  if (files) {
    for (const key in files) {
      const user_img = await fileUpload(files[key], directory)
      user.user_img = user_img
      await UserModel.updateUserBy(connection, user);
      return await UserModel.getUserByID(connection, { user_id: user.user_id });
    };
  } else {
    await UserModel.updateUserBy(connection, user);
    return await UserModel.getUserByID(connection, { user_id: user.user_id });
  }
}

Task.updatePasswordUserBy = async (connection, data) => {
  const { new_password, user_id } = data

  await UserModel.updatePasswordUserBy(connection, {
    user_id: user_id,
    user_password: new_password,
  })
}

Task.deleteUserBy = async (connection, data) => {
  const old_user = await UserModel.getUserByID(connection, data)
  await removeFile(old_user.user_img)
  UserModel.deleteUserBy(connection, data)
}

module.exports = Task