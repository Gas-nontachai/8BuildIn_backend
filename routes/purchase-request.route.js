const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { PurchaseRequestController } = require("@/controllers")

router.post("/generatePurchaseRequestID", authJwt.protect(), PurchaseRequestController.generatePurchaseRequestID)
router.post("/getPurchaseRequestBy", authJwt.protect(), PurchaseRequestController.getPurchaseRequestBy)
router.post("/getPurchaseRequestByID", authJwt.protect(), PurchaseRequestController.getPurchaseRequestByID)

router.post("/insertPurchaseRequest", authJwt.protect(), PurchaseRequestController.insertPurchaseRequest);
router.post("/updatePurchaseRequestBy", authJwt.protect(), PurchaseRequestController.updatePurchaseRequestBy);
router.post("/deletePurchaseRequestBy", authJwt.protect(), PurchaseRequestController.deletePurchaseRequestBy);

module.exports = router