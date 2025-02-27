const { useConnection } = require('@/utils/db-helper')
const { licenseStore, userStore } = require('@/stores')

const {
  UserModel,
} = require('@/models')

const initialUserResource = () => useConnection(async connection => {
  console.log("========= Initial User Resource =========");

  console.log("========= End Initial User Resource =========");
})

const getUserHasAccessBy = async (connection, data) => {
  const { branch_id, scope, actions = [] } = data

  const licenses = licenseStore.getManyLicense()
  const license_all_ids = []
  const license_ids = []
  for (const license_id in licenses) {
    const { access, license_primary } = licenses[license_id]

    if (!access[scope]) continue

    const has_access = !!actions.find(action => access[scope].includes(action))

    if (has_access) {
      license_primary ? license_all_ids.push(license_id) : license_ids.push(license_id)
    }
  }

  const { docs: user_branchs } = await UserBranchModel.getUserBranchBy(connection, { match: { branch_id } })
  const { docs: users } = await UserModel.getUserBy(connection, {
    match: {
      $or: [
        { license_id: { $in: license_all_ids }, },
        {
          $and: [
            { license_id: { $in: license_ids }, },
            { user_id: { $in: user_branchs.map(item => item.user_id) }, },
          ]
        },
      ]
    }
  })

  return users
}

const getUserNotifyActive = async (connection, data) => {
  const { branch_id, event_key, event_type } = data

  const licenses = licenseStore.getManyLicense()
  const license_all_ids = []
  const license_ids = []

  for (const license_id in licenses) {
    const {
      license_primary,
      event_mail_keys,
      event_notify_keys,
    } = licenses[license_id]

    const event_keys = event_type === 'mail' ? event_mail_keys : event_notify_keys

    if (!event_keys.includes(event_key)) continue

    license_primary ? license_all_ids.push(license_id) : license_ids.push(license_id)
  }

  const { docs: user_branchs } = await UserBranchModel.getUserBranchBy(connection, { match: { branch_id } })
  const { docs: users } = await UserModel.getUserBy(connection, {
    match: {
      $or: [
        { license_id: { $in: license_all_ids }, },
        {
          $and: [
            { license_id: { $in: license_ids }, },
            { user_id: { $in: user_branchs.map(item => item.user_id) }, },
          ]
        },
      ]
    }
  })

  return users
}

module.exports = {
  initialUserResource,
  getUserHasAccessBy,
  getUserNotifyActive,
}