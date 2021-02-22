const jwt = require("jwt-simple");
const moment = require("moment");
require("dotenv").config();

exports.createToken = function (user) {
  const payload = {
    id: user.id,
    user: user,
    iat: moment().unix(),
    exp: moment().add(30, "days").unix,
  };

  return jwt.encode(payload, process.env.SECRET_PASS);
};
