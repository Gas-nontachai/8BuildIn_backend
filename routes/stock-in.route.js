const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { StockInController } = require("@/controllers")

router.post("/generateStockInID", StockInController.generateStockInID)
router.post("/getStockInBy", StockInController.getStockInBy)
router.post("/getStockInByID", StockInController.getStockInByID)

router.post("/insertStockIn", StockInController.insertStockIn);
router.post("/updateStockInBy", StockInController.updateStockInBy);
router.post("/deleteStockInBy", StockInController.deleteStockInBy);

module.exports = router