const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { StockInController } = require("@/controllers")

router.post("/generateStockInID", authJwt.protect(), StockInController.generateStockInID)
router.post("/getStockInBy", authJwt.protect(), StockInController.getStockInBy)
router.post("/getStockInByID", authJwt.protect(), StockInController.getStockInByID)

router.post("/insertStockIn", authJwt.protect(), StockInController.insertStockIn);
router.post("/updateStockInBy", authJwt.protect(), StockInController.updateStockInBy);
router.post("/deleteStockInBy", authJwt.protect(), StockInController.deleteStockInBy);

module.exports = router