const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { LicenseController } = require("@/controllers")

// const scope = 'license'

router.post("/generateLicenseID",   LicenseController.generateLicenseID)
router.post("/getLicenseBy",   LicenseController.getLicenseBy)
router.post("/getLicenseByID",   LicenseController.getLicenseByID)

router.post(
  "/insertLicense",
   
  LicenseController.insertLicense
)
router.post(
  "/updateLicenseBy",
   
  LicenseController.updateLicenseBy
)
router.post(
  "/deleteLicenseBy",
   
  LicenseController.deleteLicenseBy
)

module.exports = router