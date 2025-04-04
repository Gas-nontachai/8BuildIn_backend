const fileupload = require('express-fileupload');
const router = require('express').Router()

const { AuthController } = require("@/controllers");

const { authJwt, } = require("@/middlewares");

router.post("/login", AuthController.login)
router.post(
    "/register",
    fileupload({ createParentPath: true }),
    AuthController.register
);
router.post("/refresh", AuthController.refresh)
router.post("/getMyCredential", authJwt.protect(), AuthController.getMyCredential)
router.post("/changePassword", authJwt.protect(), AuthController.changePassword)

module.exports = router