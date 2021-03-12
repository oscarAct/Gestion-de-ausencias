const express = require("express");
const areaController = require("../controllers/areaController");
const midAuth = require("../middlewares/auth");

const router = express.Router();

// User routes

router.get("/area/areas", midAuth.authenticated, areaController.get);
router.post("/area/save", midAuth.authenticated, areaController.save);
router.put("/area/update/:id", midAuth.authenticated, areaController.update);
router.delete("/area/delete/:id", midAuth.authenticated, areaController.delete);
module.exports = router;