const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { SupplierController } = require("@/controllers")

router.post("/generateSupplierID", authJwt.protect(), SupplierController.generateSupplierID)
router.post("/getSupplierBy", authJwt.protect(), SupplierController.getSupplierBy)
router.post("/getSupplierByID", authJwt.protect(), SupplierController.getSupplierByID)

router.post("/insertSupplier", authJwt.protect(), SupplierController.insertSupplier);
router.post("/updateSupplierBy", authJwt.protect(), SupplierController.updateSupplierBy);
router.post("/deleteSupplierBy", authJwt.protect(), SupplierController.deleteSupplierBy);

module.exports = router