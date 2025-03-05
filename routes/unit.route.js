const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { UnitController } = require("@/controllers")

router.post("/generateUnitID", authJwt.protect(), UnitController.generateUnitID)
router.post("/getUnitBy", authJwt.protect(), UnitController.getUnitBy)
router.post("/getUnitByID", authJwt.protect(), UnitController.getUnitByID)

router.post("/insertUnit", authJwt.protect(), UnitController.insertUnit);
router.post("/updateUnitBy", authJwt.protect(), UnitController.updateUnitBy);
router.post("/deleteUnitBy", authJwt.protect(), UnitController.deleteUnitBy);

module.exports = router