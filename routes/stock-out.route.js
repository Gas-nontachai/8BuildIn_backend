const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { StockOutController } = require("@/controllers")

router.post("/generateStockOutID", StockOutController.generateStockOutID)
router.post("/getStockOutBy", StockOutController.getStockOutBy)
router.post("/getStockOutByID", StockOutController.getStockOutByID)

router.post("/insertStockOut", StockOutController.insertStockOut);
router.post("/updateStockOutBy", StockOutController.updateStockOutBy);
router.post("/deleteStockOutBy", StockOutController.deleteStockOutBy);

module.exports = router