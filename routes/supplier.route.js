const router = require('express').Router()
const fileupload = require('express-fileupload')

const { authJwt } = require("@/middlewares")

const { SupplierController } = require("@/controllers")

router.post("/generateSupplierID", SupplierController.generateSupplierID)
router.post("/getSupplierBy", SupplierController.getSupplierBy)
router.post("/getSupplierByID", SupplierController.getSupplierByID)

router.post("/insertSupplier", fileupload({ createParentPath: true }), SupplierController.insertSupplier);
router.post("/updateSupplierBy", fileupload({ createParentPath: true }), SupplierController.updateSupplierBy);
router.post("/deleteSupplierBy", SupplierController.deleteSupplierBy);

module.exports = router