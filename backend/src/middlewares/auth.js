const jwt = require("jwt-simple");
const moment = require("moment");
const User = require("../models/userModel");

const secretPassword =
  "wwpc2mt8*++v-+6+@*@qwM6tyVxX&jDymQw5%Cmw5A#eV3H$@=?GkWhedpt-";

exports.authenticated = async function (req, res, next) {
  // check to the Authorization Header
  if (!req.headers.authorization) {
    return res.status(403).send({
      message: "Access denied. Missing token",
    });
  }

  // cleaning the token and removing singles quotes
  const aux = req.headers.authorization.replace(/['"]+/g, "").split(" ");
  const token = aux[1];
  let payload;
  // decrypt token
  if (aux[0] != "Bearer") {
    return res.status(403).send({
      message: "Access denied.",
    });
  }
  try {
    payload = jwt.decode(token, secretPassword);
    await User.findById(payload.id, (err, user) => {
      if (err) {
        return res
          .status(404)
          .send({ status: false, message: "User not found" });
      } else {
        payload.user = user;
      }
    });
    if (payload.exp <= moment().unix()) {
      return res.status(404).send({
        message: "Token has expired",
      });
    }
  } catch (ex) {
    return res.status(404).send({
      message: "Token invalid",
    });
  }
  req.user = payload;
  next();
};
