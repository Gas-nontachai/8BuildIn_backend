const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { UnitController } = require("@/controllers")

router.post("/generateUnitID", UnitController.generateUnitID)
router.post("/getUnitBy", UnitController.getUnitBy)
router.post("/getUnitByID", UnitController.getUnitByID)

router.post("/insertUnit", UnitController.insertUnit);
router.post("/updateUnitBy", UnitController.updateUnitBy);
router.post("/deleteUnitBy", UnitController.deleteUnitBy);

module.exports = router