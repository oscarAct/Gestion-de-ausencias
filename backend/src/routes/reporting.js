const express = require("express");
const reportingController = require("../controllers/reportingController");
const midAuth = require("../middlewares/auth");

const router = express.Router();

// User routes

router.get(
  "/reporting/absecensByReason",
  reportingController.getAbsencesXreasons
);
router.get(
  "/reporting/lastWeekAbsences",
  reportingController.getWeeklyAbsecens
);

module.exports = router;
