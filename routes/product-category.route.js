const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { ProductCategoryController } = require("@/controllers")

router.post("/generateProductCategoryID", authJwt.protect(), ProductCategoryController.generateProductCategoryID)
router.post("/getProductCategoryBy", authJwt.protect(), ProductCategoryController.getProductCategoryBy)
router.post("/getProductCategoryByID", authJwt.protect(), ProductCategoryController.getProductCategoryByID)

router.post("/insertProductCategory", authJwt.protect(), ProductCategoryController.insertProductCategory);
router.post("/updateProductCategoryBy", authJwt.protect(), ProductCategoryController.updateProductCategoryBy);
router.post("/deleteProductCategoryBy", authJwt.protect(), ProductCategoryController.deleteProductCategoryBy);

module.exports = router