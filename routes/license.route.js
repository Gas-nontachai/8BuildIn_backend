const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { LicenseController } = require("@/controllers")

// const scope = 'license'

router.post("/generateLicenseID", LicenseController.generateLicenseID)
router.post("/getLicenseBy", LicenseController.getLicenseBy)
router.post("/getLicenseByID", LicenseController.getLicenseByID)

router.post(
  "/insertLicense",
  authJwt.protect(),
  LicenseController.insertLicense
)
router.post(
  "/updateLicenseBy",
  authJwt.protect(),
  LicenseController.updateLicenseBy
)
router.post(
  "/deleteLicenseBy",
  authJwt.protect(),
  LicenseController.deleteLicenseBy
)

module.exports = router