const jwt = require("jsonwebtoken");

const controller = {};

controller.validateToken = (req, res) => {
  try {
    const token = req.headers.authorization.replace(/['"]+/g, "").split(" ")[1];
    jwt.verify(token, process.env.SECRET_PASS, (err, decoded) => {
      if (err) {
        return res.status(403).send({
          isValid: false,
          message: "Invalid token. Forbidden access.",
          error: err.message,
        });
      } else {
        return res.status(200).send({
          isValid: true,
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      isValid: false,
      error: error.message,
    });
  }
};

module.exports = controller;
