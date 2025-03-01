const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { ProductCategoryController } = require("@/controllers")

router.post("/generateProductCategoryID", ProductCategoryController.generateProductCategoryID)
router.post("/getProductCategoryBy", ProductCategoryController.getProductCategoryBy)
router.post("/getProductCategoryByID", ProductCategoryController.getProductCategoryByID)

router.post("/insertProductCategory", ProductCategoryController.insertProductCategory);
router.post("/updateProductCategoryBy", ProductCategoryController.updateProductCategoryBy);
router.post("/deleteProductCategoryBy", ProductCategoryController.deleteProductCategoryBy);

module.exports = router