const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { MenuController } = require("@/controllers")

router.post("/generateMenuID", authJwt.protect(), MenuController.generateMenuID)
router.post("/getMenuBy", authJwt.protect(), MenuController.getMenuBy)
router.post("/getMenuByID", authJwt.protect(), MenuController.getMenuByID)
router.post("/getMenuPermissionBy", authJwt.protect(), MenuController.getMenuPermissionBy)
router.post("/insertMenu", authJwt.protect(), MenuController.insertMenu);
router.post("/updateMenuBy", authJwt.protect(), MenuController.updateMenuBy);
router.post("/deleteMenuBy", authJwt.protect(), MenuController.deleteMenuBy);

module.exports = router