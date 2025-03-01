const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { MenuController } = require("@/controllers")

router.post("/generateMenuID", MenuController.generateMenuID)
router.post("/getMenuBy", MenuController.getMenuBy)
router.post("/getMenuByID", MenuController.getMenuByID)
router.post("/getMenuPermissionBy", MenuController.getMenuPermissionBy)
router.post("/insertMenu", MenuController.insertMenu);
router.post("/updateMenuBy", MenuController.updateMenuBy);
router.post("/deleteMenuBy", MenuController.deleteMenuBy);

module.exports = router