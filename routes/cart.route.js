const router = require('express').Router() 

const { authJwt } = require("@/middlewares")

const { CartController } = require("@/controllers")

router.post("/generateCartID", CartController.generateCartID);
router.post("/getCartBy", CartController.getCartBy);
router.post("/getCartByID", CartController.getCartByID);
router.post("/insertCart", CartController.insertCart);
router.post("/updateCartBy", CartController.updateCartBy);
router.post("/deleteCartBy", CartController.deleteCartBy);

module.exports = router