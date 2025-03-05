const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { CartController } = require("@/controllers")

router.post("/generateCartID", authJwt.protect(), CartController.generateCartID);
router.post("/getCartBy", authJwt.protect(), CartController.getCartBy);
router.post("/getCartByID", authJwt.protect(), CartController.getCartByID);
router.post("/insertCart", authJwt.protect(), CartController.insertCart);
router.post("/updateCartBy", authJwt.protect(), CartController.updateCartBy);
router.post("/deleteCartBy", authJwt.protect(), CartController.deleteCartBy);

module.exports = router