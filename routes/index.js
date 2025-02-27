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
    console.log(fileName);

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
  app.use(`/license`, require("./license.route"));
  app.use(`/menu`, require("./menu.route"));
  app.use(`/permission`, require("./permission.route"));
  app.use(`/user`, require("./user.route"));
}