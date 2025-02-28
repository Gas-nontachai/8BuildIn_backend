const path = require('path')
const fs = require('fs');

module.exports = (app) => {
  app.use(require('@/utils/req-handler/connect-provider'))
  app.use(require('@/utils/req-handler/res-format'))

  app.get("/", (req, res) => {
    res.json({ message: `Welcome to ${process.env.APP_NAMESPACE}.` });
  });

  app.get("/download", (req, res) => {
    const { f, n } = req.query

    if (!f || !n) res.send(500)

    res.download(path.join(__dirname, '../public/', f), n)
  });

  app.get("/check-file", (req, res) => {
    const { fileName } = req.query;

    if (!fileName) {
      return res.status(400).send({ message: "File name is required." });
    }

    const filePath = path.join(__dirname, '../public', fileName);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.json({ exists: false });
      } else {
        return res.json({ exists: true });
      }
    });
  });

  app.use(`/auth`, require("./auth.route"));
  app.use(`/customer`, require("./customer.route"));
  app.use(`/employee`, require("./employee.route"));
  app.use(`/license`, require("./license.route"));
  app.use(`/material-category`, require("./material-category.route"));
  app.use(`/material`, require("./material.route"));
  app.use(`/menu`, require("./menu.route"));
  app.use(`/permission`, require("./permission.route"));
  app.use(`/product-category`, require("./product-category.route"));
  app.use(`/product`, require("./product.route"));
  app.use(`/stock-in`, require("./stock-in.route"));
  app.use(`/stock-out`, require("./stock-out.route"));
  app.use(`/supplier`, require("./supplier.route"));
  app.use(`/unit`, require("./unit.route"));

}