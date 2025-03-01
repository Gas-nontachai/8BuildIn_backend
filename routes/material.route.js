const fileupload = require('express-fileupload')
const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { MaterialController } = require("@/controllers")

router.post("/generateMaterialID", MaterialController.generateMaterialID)
router.post("/getMaterialBy", MaterialController.getMaterialBy)
router.post("/getMaterialByID", MaterialController.getMaterialByID)

router.post("/insertMaterial", fileupload({ createParentPath: true }), MaterialController.insertMaterial);
router.post("/updateMaterialBy", fileupload({ createParentPath: true }), MaterialController.updateMaterialBy);
router.post("/deleteMaterialBy", MaterialController.deleteMaterialBy);

module.exports = router