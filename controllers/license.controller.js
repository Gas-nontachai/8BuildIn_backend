const Task = function (task) { this.task = task.task }

const { LicenseService, } = require('@/services')

Task.generateLicenseID = (req) => req.useConnection((connection) => LicenseService.generateLicenseID(connection, req.body))
Task.getLicenseBy = (req) => req.useConnection((connection) => LicenseService.getLicenseBy(connection, req.body))
Task.getLicenseByID = (req) => req.useConnection((connection) => LicenseService.getLicenseByID(connection, req.body))

Task.updateLicenseBy = (req) => req.useConnection((connection) => LicenseService.updateLicenseBy(connection, req.body))
Task.insertLicense = (req) => req.useConnection((connection) => LicenseService.insertLicense(connection, req.body))
Task.deleteLicenseBy = (req) => req.useConnection((connection) => LicenseService.deleteLicenseBy(connection, req.body))

module.exports = Task