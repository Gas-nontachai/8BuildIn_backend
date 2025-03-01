const fileupload = require('express-fileupload')
const router = require('express').Router()

const { authJwt } = require("@/middlewares");

const { EmployeeController } = require("@/controllers");

// const scope = 'employee'

router.post(
  "/generateEmployeeID",
  EmployeeController.generateEmployeeID
)

router.post(
  "/getEmployeeBy",
  EmployeeController.getEmployeeBy
)

router.post(
  "/getEmployeeByID",
  EmployeeController.getEmployeeByID
)

router.post(
  "/updateEmployeeBy",
  fileupload({ createParentPath: true }),
  EmployeeController.updateEmployeeBy
)

router.post(
  "/insertEmployee",
  fileupload({ createParentPath: true }),
  EmployeeController.insertEmployee
);

router.post(
  "/deleteEmployeeBy",
  EmployeeController.deleteEmployeeBy
)

module.exports = router