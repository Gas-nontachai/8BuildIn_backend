const fileupload = require('express-fileupload')
const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { MaterialController } = require("@/controllers")

router.post("/generateMaterialID", authJwt.protect(), MaterialController.generateMaterialID)
router.post("/getMaterialBy", authJwt.protect(), MaterialController.getMaterialBy)
router.post("/getMaterialByID", authJwt.protect(), MaterialController.getMaterialByID)

router.post("/insertMaterial", authJwt.protect(), fileupload({ createParentPath: true }), MaterialController.insertMaterial);
router.post("/updateMaterialBy", authJwt.protect(), fileupload({ createParentPath: true }), MaterialController.updateMaterialBy);
router.post("/deleteMaterialBy", authJwt.protect(), MaterialController.deleteMaterialBy);

module.exports = router