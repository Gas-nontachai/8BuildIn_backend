const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { MaterialCategoryController } = require("@/controllers")

router.post("/generateMaterialCategoryID", authJwt.protect(), MaterialCategoryController.generateMaterialCategoryID)
router.post("/getMaterialCategoryBy", authJwt.protect(), MaterialCategoryController.getMaterialCategoryBy)
router.post("/getMaterialCategoryByID", authJwt.protect(), MaterialCategoryController.getMaterialCategoryByID)

router.post("/insertMaterialCategory", authJwt.protect(), MaterialCategoryController.insertMaterialCategory);
router.post("/updateMaterialCategoryBy", authJwt.protect(), MaterialCategoryController.updateMaterialCategoryBy);
router.post("/deleteMaterialCategoryBy", authJwt.protect(), MaterialCategoryController.deleteMaterialCategoryBy);

module.exports = router