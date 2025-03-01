const fileupload = require('express-fileupload')
const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { ProductController } = require("@/controllers")

router.post("/generateProductID", ProductController.generateProductID)
router.post("/getProductBy", ProductController.getProductBy)
router.post("/getProductByID", ProductController.getProductByID)

router.post("/insertProduct", fileupload({ createParentPath: true }), ProductController.insertProduct);
router.post("/updateProductBy", fileupload({ createParentPath: true }), ProductController.updateProductBy);
router.post("/deleteProductBy", ProductController.deleteProductBy);

module.exports = router