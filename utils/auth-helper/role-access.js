const { useConnection } = require('@/utils/db-helper')
const { licenseStore } = require('@/stores')

const {
  LicenseModel,
  LicenseNotifyModel,
  PermissionModel,
} = require('@/models')

const initialRoleAccess = () => useConnection(async connection => {
  console.log("========= Initial Role Access =========");

  await refreshRoleAccess(connection)

  console.log("========= End Initial Role Access =========");
})

const extractNotifyKeys = (license_notifys) => {
  return license_notifys.reduce(
    (acc, { notify_event_key, is_email_active, is_notify_active }) => {
      if (is_email_active) acc.event_mail_keys.push(notify_event_key);
      if (is_notify_active) acc.event_notify_keys.push(notify_event_key);
      return acc;
    },
    { event_notify_keys: [], event_mail_keys: [] }
  );
};

const extractPermissions = (permissions) => {
  return permissions.reduce((access, { menu_name_en, ...perms }) => {
    if (menu_name_en && perms.permission_view) {
      access[menu_name_en] = ['view'];
      ['add', 'edit', 'approve', 'cancel', 'delete'].forEach((action) => {
        if (perms[`permission_${action}`]) access[menu_name_en].push(action);
      });
    }
    return access;
  }, {});
};

const refreshRoleAccess = async (connection) => {
  const { docs: licenses } = await LicenseModel.getLicenseBy(connection);

  for (const license of licenses) {
    const { docs: license_notifys } = await LicenseNotifyModel.getLicenseNotifyBy(connection, { license_id: license.license_id });
    const { docs: permissions } = await PermissionModel.getPermissionBy(connection, { license_id: license.license_id });

    const { event_notify_keys, event_mail_keys } = extractNotifyKeys(license_notifys);
    const access = extractPermissions(permissions);

    licenseStore.setLicense(license.license_id, {
      ...license,
      access,
      event_notify_keys,
      event_mail_keys,
    });
  }
};


module.exports = {
  initialRoleAccess,
  refreshRoleAccess,
}