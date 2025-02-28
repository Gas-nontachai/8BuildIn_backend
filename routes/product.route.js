const fileupload = require('express-fileupload')
const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { ProductController } = require("@/controllers")

router.post("/generateProductID", authJwt.protect(), ProductController.generateProductID)
router.post("/getProductBy", authJwt.protect(), ProductController.getProductBy)
router.post("/getProductByID", authJwt.protect(), ProductController.getProductByID)

router.post("/insertProduct", authJwt.protect(), fileupload({ createParentPath: true }), ProductController.insertProduct);
router.post("/updateProductBy", authJwt.protect(), fileupload({ createParentPath: true }), ProductController.updateProductBy);
router.post("/deleteProductBy", authJwt.protect(), ProductController.deleteProductBy);

module.exports = router