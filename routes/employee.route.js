const fileupload = require('express-fileupload')
const router = require('express').Router()

const { authJwt } = require("@/middlewares");

const { EmployeeController } = require("@/controllers");

// const scope = 'employee'

router.post(
  "/generateEmployeeID",
  authJwt.protect(),
  EmployeeController.generateEmployeeID
)

router.post(
  "/getEmployeeBy",
  authJwt.protect(),
  EmployeeController.getEmployeeBy
)

router.post(
  "/getEmployeeByID",
  authJwt.protect(),
  EmployeeController.getEmployeeByID
)

router.post(
  "/updateEmployeeBy",
  fileupload({ createParentPath: true }),
  authJwt.protect(),
  EmployeeController.updateEmployeeBy
)

router.post(
  "/insertEmployee",
  fileupload({ createParentPath: true }),
  authJwt.protect(),
  EmployeeController.insertEmployee
);

router.post(
  "/deleteEmployeeBy",
  authJwt.protect(),
  EmployeeController.deleteEmployeeBy
)

module.exports = router