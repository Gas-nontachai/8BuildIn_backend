const { licenseStore, userStore } = require('@/stores')

const grantAccessBranch = ({ session }, prefix = '') => {
  if (!session) return ''

  const { license_primary } = licenseStore.getLicense(session._user.license_id)

  if (license_primary) return ''

  const { branch_ids = [] } = userStore.getUser(session._id)

  return `AND ${prefix}branch_id IN ('${branch_ids.join("', '")}') `
}

const grantAccessCompany = ({ session }, prefix = '') => {
  if (!session) return ''

  const { license_primary } = licenseStore.getLicense(session._user.license_id)

  if (license_primary) return ''

  const { company_ids = [] } = userStore.getUser(session._id)

  return `AND ${prefix}company_id IN ('${company_ids.join("', '")}') `
}

module.exports = {
  grantAccessBranch,
  grantAccessCompany,
}