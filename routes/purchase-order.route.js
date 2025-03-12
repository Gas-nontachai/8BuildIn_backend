const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { PurchaseOrderController } = require("@/controllers")

router.post("/generatePurchaseOrderID", authJwt.protect(), PurchaseOrderController.generatePurchaseOrderID)
router.post("/getPurchaseOrderBy", authJwt.protect(), PurchaseOrderController.getPurchaseOrderBy)
router.post("/getPurchaseOrderByID", authJwt.protect(), PurchaseOrderController.getPurchaseOrderByID)

router.post("/insertPurchaseOrder", authJwt.protect(), PurchaseOrderController.insertPurchaseOrder);
router.post("/updatePurchaseOrderBy", authJwt.protect(), PurchaseOrderController.updatePurchaseOrderBy);
router.post("/deletePurchaseOrderBy", authJwt.protect(), PurchaseOrderController.deletePurchaseOrderBy);

module.exports = router