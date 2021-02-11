const express = require("express");
const absencesController = require("../controllers/absencesController");
const midAuth = require("../middlewares/auth");

const router = express.Router();

// User routes

router.post("/absence/save", midAuth.authenticated, absencesController.save);
router.get("/absence/getAll", midAuth.authenticated, absencesController.getAll);
router.put(
  "/absence/delete/:id",
  midAuth.authenticated,
  absencesController.delete
);
router.put(
  "/absence/update/:id",
  midAuth.authenticated,
  absencesController.update
);

module.exports = router;
