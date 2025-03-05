const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { CustomerController } = require("@/controllers")

router.post("/generateCustomerID", authJwt.protect(), CustomerController.generateCustomerID)
router.post("/getCustomerBy", authJwt.protect(), CustomerController.getCustomerBy)
router.post("/getCustomerByID", authJwt.protect(), CustomerController.getCustomerByID)

router.post("/insertCustomer", authJwt.protect(), CustomerController.insertCustomer);
router.post("/updateCustomerBy", authJwt.protect(), CustomerController.updateCustomerBy);
router.post("/deleteCustomerBy", authJwt.protect(), CustomerController.deleteCustomerBy);

module.exports = router