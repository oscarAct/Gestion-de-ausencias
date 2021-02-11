const express = require("express");
const reasonController = require("../controllers/reasonController");
const midAuth = require("../middlewares/auth");

const router = express.Router();

// User routes

router.post("/reason/save", midAuth.authenticated, reasonController.save);
router.put(
  "/reason/delete/:id",
  midAuth.authenticated,
  reasonController.delete
);

module.exports = router;
