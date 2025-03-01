const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { MaterialCategoryController } = require("@/controllers")

router.post("/generateMaterialCategoryID", MaterialCategoryController.generateMaterialCategoryID)
router.post("/getMaterialCategoryBy", MaterialCategoryController.getMaterialCategoryBy)
router.post("/getMaterialCategoryByID", MaterialCategoryController.getMaterialCategoryByID)

router.post("/insertMaterialCategory", MaterialCategoryController.insertMaterialCategory);
router.post("/updateMaterialCategoryBy", MaterialCategoryController.updateMaterialCategoryBy);
router.post("/deleteMaterialCategoryBy", MaterialCategoryController.deleteMaterialCategoryBy);

module.exports = router