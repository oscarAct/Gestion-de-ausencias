const express = require("express");
const agentsController = require("../controllers/agentsController");
const midAuth = require("../middlewares/auth");

const router = express.Router();

// User routes

router.post("/agent/save", midAuth.authenticated, agentsController.saveAgent);
router.get("/agent/getAll", midAuth.authenticated, agentsController.getAll);
router.put("/agent/delete/:id", midAuth.authenticated, agentsController.delete);
router.put("/agent/update/:id", midAuth.authenticated, agentsController.update);

module.exports = router;
