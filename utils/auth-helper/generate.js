const jwt = require("jsonwebtoken")

const config = require("@/configs/auth.config")

module.exports = {
  generateAuthJWT: (employee) => ({
    access_token: jwt.sign({ employee, }, config.secret, {
      expiresIn: config.jwt_expiration,
      issuer: config.issuer,
      audience: config.audience,
    }),
    refresh_token: jwt.sign({ employee_id: employee.employee_id, }, config.secret, {
      expiresIn: config.jwt_refresh_expiration,
      issuer: config.issuer,
      audience: config.audience,
    }),
  })
}