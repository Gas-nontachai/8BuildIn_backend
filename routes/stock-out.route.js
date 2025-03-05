const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { StockOutController } = require("@/controllers")

router.post("/generateStockOutID", authJwt.protect(), StockOutController.generateStockOutID)
router.post("/getStockOutBy", authJwt.protect(), StockOutController.getStockOutBy)
router.post("/getStockOutByID", authJwt.protect(), StockOutController.getStockOutByID)

router.post("/insertStockOut", authJwt.protect(), StockOutController.insertStockOut);
router.post("/updateStockOutBy", authJwt.protect(), StockOutController.updateStockOutBy);
router.post("/deleteStockOutBy", authJwt.protect(), StockOutController.deleteStockOutBy);

module.exports = router