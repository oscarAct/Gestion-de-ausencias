const express = require("express");
const tokenController = require("../controllers/tokenController");
const midAuth = require("../middlewares/auth");

const router = express.Router();

router.get(
  "/token/isValid",
  midAuth.authenticated,
  tokenController.validateToken
);

module.exports = router;
