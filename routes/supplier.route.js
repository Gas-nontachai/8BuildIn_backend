const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { SupplierController } = require("@/controllers")

router.post("/generateSupplierID", SupplierController.generateSupplierID)
router.post("/getSupplierBy", SupplierController.getSupplierBy)
router.post("/getSupplierByID", SupplierController.getSupplierByID)

router.post("/insertSupplier", SupplierController.insertSupplier);
router.post("/updateSupplierBy", SupplierController.updateSupplierBy);
router.post("/deleteSupplierBy", SupplierController.deleteSupplierBy);

module.exports = router