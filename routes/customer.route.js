const router = require('express').Router()

const { authJwt } = require("@/middlewares")

const { CustomerController } = require("@/controllers")

router.post("/generateCustomerID", CustomerController.generateCustomerID)
router.post("/getCustomerBy", CustomerController.getCustomerBy)
router.post("/getCustomerByID", CustomerController.getCustomerByID)

router.post("/insertCustomer", CustomerController.insertCustomer);
router.post("/updateCustomerBy", CustomerController.updateCustomerBy);
router.post("/deleteCustomerBy", CustomerController.deleteCustomerBy);

module.exports = router